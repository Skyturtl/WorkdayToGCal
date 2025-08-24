import React, { useState, useEffect, useRef } from 'react';
import uploadIcon from '../../assets/upload-icon.png';
import Button from '../../components/ui/Button';
import TextInput from '../../components/ui/TextInput';
import DayButton from '../../components/ui/DayButton';
import FileUpload from '../../components/ui/FileUpload';
import { parseXlsxFileToJson } from '../../data/xlsxParser';
import parseRegistrationJson from '../../data/registrationParser';
import { to24Hour, dayLabelToIndex } from '../../utils/date';
import TimeInput from '../../components/ui/TimeInput';
import DateInput from '../../components/ui/DateInput';
import useCalendars from '../../hooks/useCalendars';
import useCreateEvent from '../../hooks/useCreateEvent';
import useDeleteEvent from '../../hooks/useDeleteEvent';
import { useAuth } from '../../contexts/AuthContext';
import { trackFileImported, trackEventCreated } from '../../utils/analytics';

const DAYS = ['M','T','W','Th','F','Sa','Su'];

const ClassRow = ({ cls, onChange, onUpload, status, onEdit, onUnadd, deleting }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(cls.title || '');
  const titleInputRef = useRef(null);

  // Auto-size the title input so the entire text is visible while editing
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      const el = titleInputRef.current;
      el.style.width = '0px'; // shrink then measure
      const newWidth = Math.min(Math.max(el.scrollWidth + 14, 180), 800); // clamp width
      el.style.width = newWidth + 'px';
    }
  }, [draftTitle, editingTitle]);
  const toggleDay = (i) => {
    const newDays = new Set(cls.days || []);
    if (newDays.has(i)) newDays.delete(i); else newDays.add(i);
    onChange({ ...cls, days: Array.from(newDays).sort() });
  };

  const warnings = [];
  if (!(cls.days || []).length) warnings.push('⚠ Select at least one day of the week');
  if (!(cls.startTime && cls.endTime)) warnings.push('⚠ Enter a valid start and end time (e.g., 09:00)');

  const disabled = status === 'added';

  return (
    <section className="upload" id="upload">
      <div className="upload-top">
        <div className="upload-content">
          <div className="upload-header" style={{ cursor: 'pointer' }}>
            {!editingTitle && (
              <strong
                className="upload-title"
                onClick={() => { setDraftTitle(cls.title || ''); setEditingTitle(true); }}
                title="Click to edit title"
                tabIndex={0}
                onKeyDown={(e)=>{ if(e.key==='Enter'){ setDraftTitle(cls.title||''); setEditingTitle(true);} }}
                style={{ outline: 'none' }}
              >
                {cls.title || 'Untitled Class'}
              </strong>
            )}
            {editingTitle && (
              <input
                ref={titleInputRef}
                autoFocus
                value={draftTitle}
                onChange={(e)=> setDraftTitle(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key==='Enter') { e.currentTarget.blur(); }
                  if(e.key==='Escape') { setEditingTitle(false); setDraftTitle(cls.title||''); }
                }}
                onBlur={()=> {
                  const trimmed = draftTitle.trim();
                  onChange({ ...cls, title: trimmed || cls.title || 'Untitled Class' });
                  setEditingTitle(false);
                }}
                placeholder="Class title"
                className='upload-title-input'
              />
            )}
          </div>

          <div className="upload-actions">
            <TextInput placeholder="Location" value={cls.room || ''} onChange={(v)=>onChange({...cls, room: v})} className="upload-input" disabled={disabled} />
            <div className="upload-days">
              {DAYS.map((d, idx) => (
                <DayButton key={idx} label={d} variant={idx >=5 ? 'weekend' : 'weekday'} active={(cls.days||[]).includes(idx)} onToggle={() => !disabled && toggleDay(idx)} />
              ))}
            </div>
          </div>

          <div className="upload-dates-grid">
            <div className="upload-dates-col">
              <label className="upload-label">Start Time</label>
              <TimeInput value={cls.startTime||''} onChange={(v)=>onChange({...cls, startTime: v})} disabled={disabled} />
              <label className="upload-label">Start Date</label>
              <DateInput value={cls.startDate||''} onChange={(v)=>onChange({...cls, startDate: v})} disabled={disabled} />
            </div>

            <div className="upload-dates-col">
              <label className="upload-label">End Time</label>
              <TimeInput value={cls.endTime||''} onChange={(v)=>onChange({...cls, endTime: v})} disabled={disabled} />
              <label className="upload-label">End Date</label>
              <DateInput value={cls.endDate||''} onChange={(v)=>onChange({...cls, endDate: v})} disabled={disabled} />
            </div>
          </div>
        </div>

        <div className="upload-body">
          {status === 'idle' && (
            <Button
              onClick={() => onUpload(cls)}
              disabled={warnings.length > 0}
              title={warnings.length > 0 ? 'Fix validation warnings before uploading' : 'Upload to selected calendar'}
            >
              Upload
            </Button>
          )}
          {status === 'creating' && (
            <Button disabled>Uploading...</Button>
          )}
          {status === 'added' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button
                variant="success"
                disabled={deleting}
                onClick={() => onUnadd(cls)}
                onMouseEnter={(e)=> { if(deleting) return; e.currentTarget.style.background='#a4001d'; e.currentTarget.style.borderColor='#750015'; e.currentTarget.textContent='Unadd?'; }}
                onMouseLeave={(e)=> { if(deleting) return; e.currentTarget.style.background='#00c917'; e.currentTarget.style.borderColor='#008f12'; e.currentTarget.textContent='Added!'; }}
                style={{ minWidth: 88 }}
                title="Remove this created event"
              >
                Added!
              </Button>
              <Button variant="outline" onClick={() => onEdit(cls)}>Edit</Button>
            </div>
          )}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="upload-validation open">
          <div className="upload-validation-content">
            {warnings.map((w, i) => (
              <div key={i} className="upload-warning">{w}</div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const Create = () => {
  const [classes, setClasses] = useState([]);
  const [statuses, setStatuses] = useState([]); // parallel array of 'idle' | 'creating' | 'added'
  const [bulkUploading, setBulkUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const { token } = useAuth();
  const { calendars = [], loading: loadingCalendars } = useCalendars({ token });
  const { createEvent } = useCreateEvent({ token });
  const { deleteEvent, deleting } = useDeleteEvent({ token });
  const [calendarSelectedFlag, setCalendarSelectedFlag] = useState(() => {
    try { return localStorage.getItem('calendarSelected') === 'true'; } catch (e) { return false; }
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'calendarSelected') setCalendarSelectedFlag(e.newValue === 'true');
    };
    const onCustom = (ev) => { setCalendarSelectedFlag(Boolean(ev && ev.detail)); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('calendarSelectedChanged', onCustom);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('calendarSelectedChanged', onCustom); };
  }, []);

  const canUpload = !loadingCalendars && calendars && calendarSelectedFlag;

  const onFileChange = (files) => {
    if (!canUpload) return;
    if (!files || files.length === 0) return;
    setUploaded(false); // Reset uploaded state
  parseXlsxFileToJson(files[0])
      .then((json) => {
        const regs = parseRegistrationJson(json);
        const rows = regs.map(r => ({
          title: r.title,
          room: r.room || '',
          days: (r.days || []).map(d => typeof d === 'number' ? d : dayLabelToIndex(d)),
          startTime: to24Hour(r.startTime),
          endTime: to24Hour(r.endTime),
          startDate: r.startDate || '',
          endDate: r.endDate || ''
        }));
    setClasses(rows);
    setStatuses(rows.map(() => 'idle'));
    setUploaded(true); // Set uploaded to true after successful processing
    try { trackFileImported(); } catch (e) { /* ignore */ }
      })
      .catch((err) => {
        console.error('Failed to parse file', err);
        setUploaded(false); // Reset uploaded state on error
      });
  };

  const updateClass = (idx, next) => {
    const copy = classes.slice();
    copy[idx] = next;
    setClasses(copy);
  };

  const handleUpload = async (cls, idx) => {
    setStatuses(s => s.map((st,i)=> i===idx? 'creating': st));
    try {
      const created = await createEvent({
        title: cls.title,
        room: cls.room,
        days: cls.days, // numeric indices
        startDate: cls.startDate,
        endDate: cls.endDate,
        startTime: cls.startTime,
        endTime: cls.endTime,
      });
  if (created && created.id) {
        setClasses(prev => prev.map((c,i)=> i===idx ? { ...c, eventId: created.id, htmlLink: created.htmlLink } : c));
      }
  try { trackEventCreated(); } catch (e) { /* ignore */ }
      setStatuses(s => s.map((st,i)=> i===idx? 'added': st));
    } catch (e) {
      console.error('Failed to create event', e);
      window.alert('Failed to create event: ' + (e.message || e));
      setStatuses(s => s.map((st,i)=> i===idx? 'idle': st));
    }
  };

  const handleEdit = (row, idx) => {
    if (row && row.htmlLink) {
      window.open(row.htmlLink, '_blank', 'noopener');
      return;
    }
    // Fallback to calendar view if htmlLink not available
    let calId = '';
    try { calId = localStorage.getItem('selectedCalendarId') || ''; } catch (e) {}
    const base = 'https://calendar.google.com/calendar/u/0/r';
    const url = calId ? `${base}?cid=${encodeURIComponent(calId)}` : base;
    window.open(url, '_blank', 'noopener');
  };

  const handleBulkUpload = async () => {
    if (bulkUploading) return;
    const idleIndexes = statuses.map((st,i)=> st==='idle' ? i : -1).filter(i=> i!==-1);
    if (!idleIndexes.length) return;
    setBulkUploading(true);
    for (const idx of idleIndexes) {
      // If user started a manual upload mid-bulk, skip.
      if (statuses[idx] !== 'idle') continue;
      try {
        await handleUpload(classes[idx], idx);
      } catch (e) {
        // continue with next
      }
    }
    setBulkUploading(false);
  };

  // Remove event, revert to editable/upload state
  const handleUnadd = async (row, idx) => {
    if (!row.eventId) return;
    try {
      await deleteEvent(row.eventId);
      setClasses(prev => prev.map((c,i)=> i===idx ? { ...c, eventId: undefined, htmlLink: undefined } : c));
      setStatuses(s => s.map((st,i)=> i===idx ? 'idle' : st));
    } catch (e) {
      console.error('Failed to delete event', e);
      window.alert('Failed to delete event: ' + (e.message || e));
    }
  };

  return (
    <section className="create">
      <h1>Classes</h1>
      <div className="upload-container">
        <div>
          <label style={{ display: 'block', marginBottom: 6, color: '#555' }}>Upload Workday Excel File</label>
          <FileUpload onChange={onFileChange} disabled={!canUpload} />
          {loadingCalendars && <div className='loading-text' >Loading calendars...</div>}
          {uploaded && (
            <div className='success-text'>
              <h2 style={{ fontSize: '1.5em', margin: '12px 0 4px 0', color: '#00c917' }}>
                File uploaded successfully!
              </h2>
              <p style={{ margin: "0 0 12px 0", fontSize: '1em' }}>
                Scroll down to see your classes
              </p>
            </div>
          )}
          {!canUpload && (
            <div className='error-text'>No calendars available — create or select a calendar first.</div>
          )}
        </div>
        <div className='upload-steps'>
          <p><span className='step-icon'>①</span>Click on Menu and head to Academics Hub</p>
          <p><span className='step-icon'>②</span>Click on Current Classes and View Details</p>
          <p><span className='step-icon'>③</span>On the top right click this icon <img src={uploadIcon} style={{ margin: '0 0 -3.5px -3px', width: 28, height: 'auto', verticalAlign: 'text-bottom' }} alt="Workday export (upload) icon" /></p>
          <p><span className='step-icon'>④</span>Now upload the downloaded Excel file here!</p>
        </div>
      </div>
      <iframe
        title="Workday Instructions"
        src="https://www.youtube.com/embed/VpqEzgCRgM8"
        style={{ width: '80%', height: '400px', border: 'none', margin: '12px 0', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        allowFullScreen
      />
      <div style={{ margin: '32px 0 12px 0' }}>
        <Button
          onClick={handleBulkUpload}
          disabled={bulkUploading || !statuses.some(s => s === 'idle')}
          variant="primary"
          title="Create events for all rows not yet added"
        >
          {bulkUploading ? 'Uploading Remaining...' : 'Upload All Remaining'}
        </Button>
      </div>
      <div style={{ border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
        {classes.map((c, i) => (
          <ClassRow
            key={i}
            cls={c}
            onChange={(next) => updateClass(i, next)}
            onUpload={(row) => handleUpload(row, i)}
            status={statuses[i] || 'idle'}
            onEdit={(row) => handleEdit(row, i)}
            onUnadd={(row) => handleUnadd(row, i)}
            deleting={deleting}
          />
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
  <Button onClick={() => { setClasses([...classes, { title: 'New Class', days: [], startTime:'', endTime:'', startDate:'', endDate:'' }]); setStatuses([...statuses, 'idle']); }}>Add Row</Button>
      </div>
    </section>
  );
};

export default Create;
