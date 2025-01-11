import React, { useState } from 'react';
import './MainPage.css';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import AboutProduct from './components/AboutProduct';

function MainPage() {
  const [activeSection, setActiveSection] = useState('about-product');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'about-us':
        return <AboutUs />;
      case 'contact-us':
        return <ContactUs />;
      case 'about-product':
      default:
        return <AboutProduct />;
    }
  };

  return (
    <main className="main-page">
      <nav className="main-nav">
        <button onClick={() => setActiveSection('about-product')} className={activeSection === 'about-product' ? 'active' : ''}>About the Product</button>
        <button onClick={() => setActiveSection('about-us')} className={activeSection === 'about-us' ? 'active' : ''}>About Us</button>
        <button onClick={() => setActiveSection('contact-us')} className={activeSection === 'contact-us' ? 'active' : ''}>Contact Us</button>
      </nav>
      <div className="active-section">
        {renderActiveSection()}
      </div>
    </main>
  );
}

export default MainPage;