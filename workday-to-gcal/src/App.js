import './App.css';
import Navbar from './layouts/Navbar';
import Login from './pages/Home/Login';
import Footer from './layouts/Footer';
import CalendarList from './pages/Home/CalendarList';
import Create from './pages/Home/Create';
import PrivacyPolicy from './pages/Home/PrivacyPolicy';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // On every full page load, clear persisted calendar selection so user must reselect after login.
    try {
      localStorage.removeItem('selectedCalendarId');
      localStorage.setItem('calendarSelected', 'false');
      window.dispatchEvent(new CustomEvent('selectedCalendarIdChanged', { detail: '' }));
      window.dispatchEvent(new CustomEvent('calendarSelectedChanged', { detail: false }));
    } catch (e) {}
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Login />
        <CalendarList />
        <Create />
        <PrivacyPolicy />
      </div>
      <Footer />
    </>
  );
}

export default App;
