import React from "react";
import '../../resource/css/util/Footer.css'; // 스타일링을 위한 CSS 파일 임포트

function Footer() {
  return (
    <footer className="footer">
      <p>© 2024 MyWebsite. All rights reserved.</p>
      <div className="footer-links">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-of-service">Terms of Service</a>
        <a href="/contact-us">Contact Us</a>
        <a href="/customer-service">고객센터</a>
        하이
      </div>
    </footer>
  );
}

export default Footer;