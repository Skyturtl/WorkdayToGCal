const Navbar = ({ isPrivacy }) => {
  return (
    <nav className="navbar">
      <span className="navbar-logo">Workday2GCal</span>
      <ul className="navbar-links">
        {isPrivacy ? (
          <li><a href="#/">Home</a></li>
        ) : (
          <>
            <li><a href="#login">Home</a></li>
            <li><a href="#login">Login</a></li>
            <li><a href="#calendars">Calendars</a></li>
          </>
        )}
          <li><a href={(process.env.PUBLIC_URL || '') + '/privacy.html'}>Privacy</a></li>
      </ul>
    </nav>
  );
};
 
export default Navbar;