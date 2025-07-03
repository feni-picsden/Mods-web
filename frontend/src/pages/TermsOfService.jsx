import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/PrivacyPolicy.css";
import { FaChevronRight } from "react-icons/fa";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";

function TermsOfService() {
  useEffect(() => {
    setCanonicalTag(buildCanonicalUrl('/terms-of-use'));
  }, []);

  return (
    <div className="privacy-policy-container">
      <div className="privacy-banner">
        <div className="privacy-banner-overlay">
          <div className="privacy-header-content">
            <h1 className="privacy-title">Terms of Use</h1>
            <p className="privacy-subtitle">Please read our terms carefully</p>
          </div>
        </div>
      </div>

      <div className="privacy-breadcrumb-section">
        <div className="breadcrumb-container">
          <div className="breadcrumb-navigation">
            <Link to="/" className="breadcrumb-item">
              Home
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-item current">Terms of Use</span>
          </div>
        </div>
      </div>

      <div className="privacy-content">
        <div className="privacy-container">
          <div className="privacy-last-updated">
            <p><strong>Effective Date:</strong> 27th June 2025</p>
          </div>

          <div className="privacy-intro">
            <p>
              Welcome to Modcarft ("we," "us," "our"). By accessing or using our website https://www.modcarft.com (the "Website"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree with any part of these Terms, you must not use the Website.
              These Terms apply to all visitors, users, and others who access or use the Website.
            </p>
          </div>

          <div className="privacy-section">
            <h2>1. Use of the Website</h2>
            <p>Modcarft provides downloadable content for Minecraft, including mods, addons, skins, and maps. By using this Website, you agree to:</p>
            <ul>
              <li>Use the Website only for lawful purposes</li>
              <li>Not violate any applicable local, state, national, or international law</li>
              <li>Not use the Website in any manner that could disable, overburden, or impair it</li>
            </ul>
            <p>You may not attempt to gain unauthorized access to any portion of the Website or any systems connected to the Website.</p>
          </div>

          <div className="privacy-section">
            <h2>2. Intellectual Property</h2>
            <p>
              All content available on Modcarft, including but not limited to text, graphics, images, digital files, and website design, is the property of Modcarft or its content providers and is protected by copyright and intellectual property laws.
            </p>
            <p>
              The Minecraft-related content (e.g., mods, skins, and maps) may be subject to Mojang's End User License Agreement (EULA). Modcarft is not affiliated with Mojang AB or Microsoft.
            </p>
            <p>
              You may download content for personal, non-commercial use only. Redistribution, resale, or modification for commercial purposes is strictly prohibited unless explicitly stated otherwise.
            </p>
          </div>

          <div className="privacy-section">
            <h2>3. Digital Products and Purchases</h2>
            <p>Modcarft offers digital downloads, which may include paid content. By making a purchase, you acknowledge and agree that:</p>
            <ul>
              <li>All sales of digital products are final</li>
              <li>No refunds will be issued once a download has been initiated</li>
              <li>Prices and availability of content may change at any time without notice</li>
            </ul>
            <p>You are responsible for ensuring compatibility with your Minecraft version or device before purchase. We are not liable for any incompatibility issues.</p>
          </div>

          <div className="privacy-section">
            <h2>4. User Content and Submissions</h2>
            <p>
              By submitting any content (e.g., via the contact form or email), you grant Modcarft a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content for the purpose of responding or improving our services.
            </p>
            <p>
              You agree not to submit content that is unlawful, offensive, or infringes on the rights of any third party.
            </p>
          </div>

          <div className="privacy-section">
            <h2>5. Third-Party Services</h2>
            <p>
              We use third-party services for analytics (e.g., Google Analytics) and advertising (e.g., Google AdSense). Your use of the Website may be subject to the privacy policies and terms of these providers.
            </p>
            <p>
              We are not responsible for the content or services of third-party websites linked to or from Modcarft. Accessing third-party sites is at your own risk.
            </p>
          </div>

          <div className="privacy-section">
            <h2>6. Disclaimer of Warranties</h2>
            <p>
              The Website and all content and downloads are provided "as is" and "as available" without warranties of any kind, either express or implied.
            </p>
            <p>We do not guarantee:</p>
            <ul>
              <li>That the content will be error-free or accurate</li>
              <li>That downloads will be free of viruses or harmful components</li>
              <li>That the Website will be uninterrupted or secure</li>
            </ul>
            <p>You use the Website at your own risk.</p>
          </div>

          <div className="privacy-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Modcarft shall not be liable for any damages arising from your use of the Website or downloadable content, including but not limited to:
            </p>
            <ul>
              <li>Data loss or corruption</li>
              <li>System crashes or performance issues</li>
              <li>Incompatibility with Minecraft or your device</li>
            </ul>
            <p>
              Our total liability for any claim arising out of or relating to these Terms shall not exceed the amount paid by you, if any, for accessing the Website.
            </p>
          </div>

          <div className="privacy-section">
            <h2>8. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to the Website without notice or liability, for any reason, including breach of these Terms.
            </p>
          </div>

          <div className="privacy-section">
            <h2>9. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this page with an updated "Effective Date." By continuing to use the Website after such changes, you accept the revised Terms.
            </p>
          </div>

          <div className="privacy-section">
            <h2>10. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of india, without regard to its conflict of law principles.
            </p>
          </div>

          <div className="privacy-section">
            <h2>11. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            
            <div className="privacy-info">
              <div className="contact-method">
                <h4>Modcarft</h4>
                <p>Email: <a href="mailto:support@modcarft.com">support@modcarft.com</a></p>
                <p>Website: <a href="https://www.modcarft.com" target="_blank" rel="noopener noreferrer">https://www.modcarft.com</a></p>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}

export default TermsOfService; 