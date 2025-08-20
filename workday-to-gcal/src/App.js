import './App.css';
import Navbar from './layouts/Navbar';
import Upload from './pages/Home/Upload';
import Login from './pages/Home/Login';
import Footer from './layouts/Footer';
import CalendarList from './pages/Home/CalendarList';

function App() {
  return (
    <>
      <Navbar />  
      <div className="main-content">
        <Login />
        <CalendarList />
        <Upload />
      </div>
      <Footer />
    </>
  );
}

export default App;
