import './App.css';
import Navbar from './components/Navbar.tsx';
import Upload from './components/Upload.tsx';
import Footer from './components/Footer.tsx';
import Sample from './components/Sample.tsx';

function App() {
  return (
    <>
      <Navbar />  
      <Sample />
      <Upload />
      <Footer />
    </>
  );
}

export default App;
