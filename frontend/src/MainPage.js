import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './MainPage.css';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import AboutProduct from './components/AboutProduct';
import Home from './components/Home';

function MainPage({
  company,
  setCompany,
  handleSearch,
  showResults,
  articles,
  netCashFlow,
  error
}) {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();  

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <Home
            company={company}
            setCompany={setCompany}
            handleSearch={() => {
              handleSearch();
              navigate('/search-results', { state: { companyName: company } });  // Pass company name to SearchResultsPage
            }}
          />
        );
      case 'about-us':
        return <AboutUs />;
      case 'contact-us':
        return <ContactUs />;
      case 'about-product':
        return <AboutProduct />;
      default:
        return null;
    }
  };

  return (
    <main className="main-page">
      <nav className="main-nav">
        <button
          onClick={() => setActiveSection('home')}
          className={activeSection === 'home' ? 'active' : ''}
        >
          Home
        </button>
        <button
          onClick={() => setActiveSection('about-product')}
          className={activeSection === 'about-product' ? 'active' : ''}
        >
          Product
        </button>
        <button
          onClick={() => setActiveSection('about-us')}
          className={activeSection === 'about-us' ? 'active' : ''}
        >
          About Us
        </button>
        <button
          onClick={() => setActiveSection('contact-us')}
          className={activeSection === 'contact-us' ? 'active' : ''}
        >
          Contact Us
        </button>
      </nav>

      <div className="active-section">{renderActiveSection()}</div>
    </main>
  );
}

export default MainPage;
