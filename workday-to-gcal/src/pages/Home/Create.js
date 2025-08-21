import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import TextInput from '../../components/ui/TextInput';
import DayButton from '../../components/ui/DayButton';
import FileUpload from '../../components/ui/FileUpload';
import { parseXlsxFileToJson } from '../../data/xlsxParser';
import parseRegistrationJson from '../../data/registrationParser';
import { to24Hour, dayLabelToIndex } from '../../utils/date';
import TimeInput from '../../components/ui/TimeInput';
import DateInput from '../../components/ui/DateInput';

const DAYS = ['M','T','W','Th','F','Sa','Su'];

const ClassRow = ({ cls, onChange }) => {
  const toggleDay = (i) => {
    const newDays = new Set(cls.days || []);
    if (newDays.has(i)) newDays.delete(i); else newDays.add(i);
    onChange({ ...cls, days: Array.from(newDays).sort() });
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 12, borderBottom: '1px solid #eee' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 14 }}>{cls.title}</strong>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <TextInput placeholder="Location" value={cls.room || ''} onChange={(v)=>onChange({...cls, room: v})} style={{width:260}} />
          </div>
        </div>

        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {DAYS.map((d, idx) => (
              <DayButton key={idx} label={d} variant={idx >=5 ? 'weekend' : 'weekday'} active={(cls.days||[]).includes(idx)} onToggle={() => toggleDay(idx)} />
            ))}
          </div>

          <div style={{ marginLeft: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <TimeInput value={cls.startTime||''} onChange={(v)=>onChange({...cls, startTime: v})} />
            <span style={{color:'#666'}}>to</span>
            <TimeInput value={cls.endTime||''} onChange={(v)=>onChange({...cls, endTime: v})} />
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ color: '#555', fontSize: 13 }}>Start</label>
          <DateInput value={cls.startDate||''} onChange={(v)=>onChange({...cls, startDate: v})} />
          <label style={{ color: '#555', fontSize: 13 }}>End</label>
          <DateInput value={cls.endDate||''} onChange={(v)=>onChange({...cls, endDate: v})} />
        </div>
      </div>

      <div style={{ width: 110, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="outline" onClick={() => console.log('Add single', cls)} style={{width:'100%'}}>
          Add
        </Button>
        <Button onClick={() => console.log('Upload', cls)} style={{width:'100%'}}>
          Upload
        </Button>
      </div>
      {/* Validation warnings */}
      <div style={{ flexBasis: '100%', paddingTop: 8 }}>
        <div style={{ transition: 'all 220ms ease' }}>
          {(!(cls.days || []).length) && (
            <div style={{ color: '#b00020', fontSize: 13, opacity: 1 }}>⚠ Select at least one day of the week</div>
          )}
          {(!(cls.startTime && cls.endTime)) && (
            <div style={{ color: '#b00020', fontSize: 13, opacity: 1 }}>⚠ Enter a valid start and end time (e.g., 09:00)</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Create = () => {
  const [classes, setClasses] = useState([]);

  const onFileChange = (files) => {
    if (!files || files.length === 0) return;
    parseXlsxFileToJson(files[0])
      .then((json) => {
        const regs = parseRegistrationJson(json);
        // Convert parser fields to class row shape
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
      })
      .catch((err) => console.error('Failed to parse file', err));
  };

  const updateClass = (idx, next) => {
    const copy = classes.slice();
    copy[idx] = next;
    setClasses(copy);
  };

  return (
    <section className="create main-content">
      <h1>Classes</h1>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6, color: '#555' }}>Upload Workday XLSX</label>
        <FileUpload onChange={onFileChange} />
      </div>
      <div style={{ border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
        {classes.map((c, i) => (
          <ClassRow key={i} cls={c} onChange={(next) => updateClass(i, next)} />
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button onClick={() => setClasses([...classes, { title: 'New Class', days: [], startTime:'', endTime:'', startDate:'', endDate:'' }])}>Add Row</Button>
        <Button variant="outline" onClick={() => console.log('Save')}>Save</Button>
      </div>
    </section>
  );
};

export default Create;
