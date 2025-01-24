import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <section className="about-us">
      <div className="about-us-container">
        <div className='combo1'>
          {/* Our Story Section */}
          <div className="our-story">
            <h2>Our Story</h2>
            <p>
              We are <strong>FinSight</strong>, a pioneering financial platform dedicated to empowering individuals with the tools and insights they need to navigate the complexities of the stock market. Our platform combines real-time data, advanced analytics, and sentiment-driven insights to support smarter investment decisions.
            </p>
          </div>

          <div className="image_1">
            {/* Image for product-left-down div */}
          </div>
        </div> 

        {/* Mission Section */}
        <div className="our-mission">
          <h2>Our Mission</h2>
          <p>
            Our mission is to democratize access to high-quality financial tools and resources, enabling investors worldwide to make informed, confident, and data-driven decisions in a fast-paced, ever-changing market landscape.
          </p>
        </div>

        {/* Values Section */}
        <div className='combo_2'>
          
          <div className="image_2">
              {/* Image2 */}
          </div>

          <div className="core-values">
            <h2>Our Values</h2>
            <ul>
              <li><strong>Innovation:</strong> We constantly strive to innovate and create impactful solutions that help our users succeed.</li>
              <li><strong>Integrity:</strong> We maintain transparency and uphold the highest ethical standards in all our actions.</li>
              <li><strong>Empowerment:</strong> We believe in empowering individuals with the tools they need to take control of their financial futures.</li>
            </ul>
          </div>
        </div> 

        {/* Join Us Section */}
        <div className="join-us-section">
          <h2>Join Us</h2>
          <p>
            At <strong>FinSight</strong>, we are committed to providing our users with the best possible tools to succeed in the financial markets. Join us and experience a platform that delivers data, insights, and analytics that enable better investment decisions every day.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
