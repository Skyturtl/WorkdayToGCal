const Navbar = () => {
  return (
    <nav className="navbar">
        <span className="navbar-logo">Workday2GCal</span>
        <ul className="navbar-links">
          <li><a href="#login">Home</a></li>
          <li><a href="#login">Login</a></li>
          <li><a href="#calendars">Calendars</a></li>
          <li><a href="#privacy">Privacy</a></li>
        </ul>
    </nav>
  );
}
 
export default Navbar;