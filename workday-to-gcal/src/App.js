import './App.css';
import Navbar from './layouts/Navbar';
import Login from './pages/Home/Login';
import Footer from './layouts/Footer';
import CalendarList from './pages/Home/CalendarList';
import Create from './pages/Home/Create';
import PrivacyPolicy from './pages/Home/PrivacyPolicy';
import { useEffect, useState } from 'react';

function App() {
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));

  useEffect(() => {
    // On every full page load, clear persisted calendar selection so user must reselect after login.
    try {
      localStorage.removeItem('selectedCalendarId');
      localStorage.setItem('calendarSelected', 'false');
      window.dispatchEvent(new CustomEvent('selectedCalendarIdChanged', { detail: '' }));
      window.dispatchEvent(new CustomEvent('calendarSelectedChanged', { detail: false }));
    } catch (e) {}
  }, []);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isPrivacy = hash === '#/privacy';

  // Always reset scroll to top when switching between main app and privacy page
  useEffect(() => {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch (e) {}
  }, [isPrivacy]);

  return (
    <>
      <Navbar isPrivacy={isPrivacy} />
      <div className="main-content">
        {isPrivacy ? (
          <PrivacyPolicy />
        ) : (
          <>
            <Login />
            <CalendarList />
            <Create />
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;
