import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/PrivacyPolicy.css";
import {FaChevronRight } from "react-icons/fa";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";

function PrivacyPolicy() {
  useEffect(() => {
    setCanonicalTag(buildCanonicalUrl('/privacy-policy'));
  }, []);

  return (
    <div className="privacy-policy-container">
      {/* Header Section */}
      <div className="privacy-banner">
        <div className="privacy-banner-overlay">
          <div className="privacy-header-content">
            <h1 className="privacy-title">Privacy Policy</h1>
            <p className="privacy-subtitle">Your privacy is important to us</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="privacy-breadcrumb-section">
        <div className="breadcrumb-container">
          <div className="breadcrumb-navigation">
            <Link to="/" className="breadcrumb-item">
               Home
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-item current">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="privacy-content">
        <div className="privacy-container">
          <div className="privacy-last-updated">
            <p><strong>Effective Date:</strong> 27/06/2025</p>
          </div>

          <div className="privacy-intro">
            <p>
              At Modcarft ("we," "our," or "us"), your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website https://www.modcarft.com (the "Website"), which provides downloadable content for Minecraft, including mods, addons, skins, and maps.
              Please read this policy carefully. By accessing or using the Website, you agree to the collection and use of your information as described in this Privacy Policy.
            </p>
          </div>

          <div className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy is designed to help you understand what data we collect, why we collect it, and what we do with it. We are committed to protecting your personal data and ensuring transparency in our practices.
            </p>
            <p>
              This policy is compliant with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
            </p>
          </div>

          <div className="privacy-section">
            <h2>2. Information We Collect</h2>
            
            <h3>A. Personal Information (provided by you)</h3>
            <p>When you contact us via our contact form, we may collect:</p>
            <ul>
              <li>First Name</li>
              <li>Last Name</li>
              <li>Email Address</li>
              <li>Any message or inquiry you submit</li>
            </ul>
            <p>Note: We do not offer account creation or sign-in functionality, so we do not store passwords or similar credentials.</p>

            <h3>B. Non-Personal Information (collected automatically)</h3>
            <p>When you access the Website, we may automatically collect:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referral source</li>
              <li>Pages visited and time spent on the site</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>To respond to inquiries submitted via the contact form</li>
              <li>To process digital purchases through secure third-party payment processors</li>
              <li>To analyze and improve the Website's content and performance</li>
              <li>To serve advertisements via third-party ad networks</li>
              <li>To comply with legal obligations, including fraud prevention and enforcement of our Terms of Service</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>4. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Track user behavior for analytics purposes (e.g., Google Analytics)</li>
              <li>Serve personalized advertisements</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>5. Third-Party Services</h2>
            <p>We use the following third-party services, each of which may collect, store, and process data according to their privacy policies:</p>
            
            <h3>Google Analytics:</h3>
            <p>Used to collect usage statistics</p>
            <p>Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></p>

            <h3>Advertising Networks:</h3>
            <p>Such as Google AdSense, which use cookies for personalized ads</p>

            {/* <h3>Payment Processors:</h3>
            <p>To handle digital purchases. These services are governed by their own privacy practices.</p> */}

            <p>We do not sell your personal information. However, third parties may collect data in accordance with their own policies, which we encourage you to review.</p>
          </div>
          <div className="privacy-section">
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p>
              However, no internet transmission or electronic storage method is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
            </p>
          </div>

          <div className="privacy-section">
            <h2>7. Your Data Protection Rights</h2>
            
            <h3>Under GDPR (EU/EEA residents):</h3>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectify incorrect or incomplete data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to object to data processing</li>
              <li>Right to data portability</li>
            </ul>

            <h3>Under CCPA (California residents):</h3>
            <ul>
              <li>Right to know what personal information is collected and how it's used</li>
              <li>Right to request deletion of personal information</li>
              <li>Right to opt-out of the sale of personal information (modcarft does not sell data)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>

            <p>To exercise any of these rights, please contact us using the information below.</p>
          </div>

          <div className="privacy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our Website is not intended for children under the age of 13 (or 16 in the EEA), and we do not knowingly collect personal information from children. If we become aware that we have inadvertently collected such data, we will take steps to delete it promptly.
            </p>
          </div>

          <div className="privacy-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated "Effective Date."
            </p>
            <p>
              We recommend reviewing this Privacy Policy periodically to stay informed.
            </p>
          </div>

          <div className="privacy-section">
            <h2>10. Contact Information</h2>
            <p>If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us at:</p>
            
            <div className="privacy-info">
              <div className="contact-method">
                <h4>Modcarft</h4>
                <p>Email: <a href="mailto:support@modcarft.com">support@modcarft.com</a></p>
                <p>Website: <a href="https://www.modcarft.com" target="_blank" rel="noopener noreferrer">https://www.modcarft.com</a></p>
              </div>
            </div>
          </div>
          <div className="privacy-section">
            <h2>DISCLAIMER</h2>
            <p>
              "NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT."
            </p>
            <p>
              In accordance with <a href="https://www.minecraft.net/en-us/usage-guidelines" target="_blank" rel="noopener noreferrer">https://www.minecraft.net/en-us/usage-guidelines</a>
            </p>
            <p>
              All files provided for download in this application are provided under a free distribution license. We in no way claim copyright or intellectual property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy; 