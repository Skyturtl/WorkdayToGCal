const Footer = () => (
  <footer className="footer" role="contentinfo">
    <div className="footer-inner">
      <h2 className="footer-title">About the Site</h2>
      <p className="footer-text">
        Hi everyone! I'm William Chen, a student at Washington University in St. Louis (Class of 2026),
        majoring in Computer Science with a minor in Human-Computer Interaction. 
        I built this tool because the Workday app is not really fun to use,
        so this helps move everything into Google Calendar automatically. 
        This site took way longer than I would want to admit but I'm providing it 
        for free in hopes that it saves you some time and is easy to use.
        It's primarily designed for Washington University students, but if you also use Workday, it might work for you too. 
        Just a heads up, the formatting might not be great in that case.
      </p>
      <p className="footer-text">
        This site is <strong>not affiliated</strong> with Google or Washington University. Read the{' '}
          <a href={(process.env.PUBLIC_URL || '') + '/privacy.html'} className="footer-link">Privacy Policy</a>. 
        <br />
        <br />
        For bugs, questions, or feedback email{' '}
        <a href="mailto:william88800@hotmail.com" className="footer-link">william88800@hotmail.com</a>.
      </p>
      <div className="footer-meta">&copy; {new Date().getFullYear()} William Chen</div>
    </div>
  </footer>
);

export default Footer;
