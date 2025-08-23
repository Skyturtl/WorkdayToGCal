import './App.css';
import Navbar from './layouts/Navbar';
import Login from './pages/Home/Login';
import Footer from './layouts/Footer';
import CalendarList from './pages/Home/CalendarList';
import Create from './pages/Home/Create';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
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
      </div>
      <Footer />
    </>
  );
}

export default App;
