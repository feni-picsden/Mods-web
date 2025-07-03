import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaUser, FaEnvelope, FaComment, FaBook } from "react-icons/fa";
import axios from "axios";
import "../styles/Contact.css";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    setCanonicalTag(buildCanonicalUrl('/contact'));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(
        "http://192.168.29.13:4000/api/contact/submit",
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        {
          headers: {
            "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
            "Content-Type": "application/json"
          },
        }
      );

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <div className="contact-page-title-section">
            <h1 className="page-title">Contact Us</h1>
            <p className="contact-page-description">
              Get in touch with us! We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="contact-content">
        
        <div className="container">
        <div className="breadcrumb-section">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-current">Contact Us</span>
          </div>
          <div className="contact-form-wrapper">
            <div className="contact-form-container">
              <h2 className="form-title">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <FaUser className="label-icon" />
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope className="label-icon" />
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    <FaBook  className="label-icon" />
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter the subject of your message"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    <FaComment className="label-icon" />
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Enter your message here..."
                    rows="6"
                    required
                  ></textarea>
                </div>
                <div className="form-submit">
                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
                {submitStatus === 'success' && (
                  <div className="status-message success">
                    <p>✓ Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="status-message error">
                    <p>✗ Sorry, there was an error sending your message. Please try again.</p>
                  </div>
                )}
              </form>
            </div>
            <div className="contact-info">
              <h3 className="info-title">Get in Touch</h3>
              <div className="info-content">
                <div className="info-item">
                  <h4>Customer Support</h4>
                  <p>We're here to help you with any questions about our mods and services.</p>
                </div>                
                <div className="info-item">
                  <h4>Response Time</h4>
                  <p>We typically respond within 24-48 hours during business days.</p>
                </div>                
                <div className="info-item">
                  <h4>Follow Us</h4>
                  <p>Stay updated with the latest mods and news on our social media channels.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 