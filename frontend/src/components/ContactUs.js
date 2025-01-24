import React from 'react';
import './ContactUs.css';

function ContactUs() {
  return (
    <section className="contact-us">
      <div className="contact-main">
        {/* Content Section */}
     
          <h2>Contact Us</h2>
          <p className="contact-description">
            We’d love to hear from you! Feel free to reach out via email or phone, and we’ll get back to you as soon as possible.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <h3>Email</h3>
              <p>
                <a href="mailto:finsight@gmail.com" className="contact-link">
                  finsight@gmail.com
                </a>
              </p>
            </div>
            <div className="contact-item">
              <h3>Phone</h3>
              <p>
                <a href="tel:+971507375374" className="contact-link">
                  +971 50 737 5374
                </a>
              </p>
            </div>
          </div>
       

        {/* Image Section */}
        <div className="contact-image">
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
