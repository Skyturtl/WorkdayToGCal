const Navbar = () => {
  return (
    <nav className="navbar" id="top">
        <span className="navbar-logo">Workday2GCal</span>
        <ul className="navbar-links">
          <li><a href="#top">Home</a></li>
          <li><a href="#login">Login</a></li>
          <li><a href="#calendars">Calendars</a></li>
          <li><a href="#upload">Upload</a></li>
        </ul>
    </nav>
  );
}
 
export default Navbar;