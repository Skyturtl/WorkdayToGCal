import './App.css';
import Navbar from './layouts/Navbar';
import Upload from './pages/Home/Upload';
import Login from './pages/Home/Login';
import Footer from './layouts/Footer';

function App() {
  return (
    <>
      <Navbar />  
      <Login />
      <Upload />
      <Footer />
    </>
  );
}

export default App;
