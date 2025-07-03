import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaArrowLeft } from "react-icons/fa";
import "../styles/InstallationSteps.css";
import appStore from "../assets/appstore.png";
import playStore from "../assets/playstore.png";
import defaultHeaderImage from "../assets/default_header_image.jpg";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";

const InstallationSteps = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    setCanonicalTag(buildCanonicalUrl('/installation-steps'));
  }, []);

  const steps = [
    {
      id: 1,
      title: "Step one",
      buttonText: "Download CurseForge",
      description: "Finish installation & set up",
    },
    {
      id: 2,
      title: "Step two",
      buttonText: "Setup App",
      description: "Finish installation & set up",
    },
    {
      id: 3,
      title: "Step three",
      buttonText: "Click to install the mod",
      description: "Click to install the mod",
    },
  ];

  const handleStepClick = (stepId) => {
    setActiveStep(stepId);
  };

  return (
    <div className="installation-page">
       <div className="mod-banner">
        <img
          src={defaultHeaderImage}
          alt="Modcraft Mods"
          className="mod-banner-image"
        />
      </div>
   

      <div className="installation-content">
        <div className="container">
          <div className="main-title-section">
            <h1 className="main-title">To install Mods</h1>
            <p className="main-subtitle">first install the app!</p>
          </div>

          <div className="steps-container">
            <div className="step-item main-step">
              <div className="step-circle active">
                <span className="step-number">1</span>
              </div>
              <h3 className="step-title">Step one</h3>
              <p className="step-description">
                  Download app
                </p>
              <div className="app-download-section">
                <div className="download-buttons">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mods.minecraft.mc.pe.addons.shader"
                    target="_blank"
                    className="download-btn google-play"
                  >
                    <img src={playStore} alt="Get it on Google Play" />
                  </a>
                  <a
                    href="https://apps.apple.com/app/addons-skin-for-minecraft-pe/id1636851298"
                    target="_blank"
                    className="download-btn app-store"
                  >
                    <img src={appStore} alt="Download on the App Store" />
                  </a>
                </div>
              </div>
            </div>

            <div className="side-steps">
              <div className="step-item side-step">
                <div className="step-circle">
                  <span className="step-number">2</span>
                </div>
                <h3 className="step-title">Step two</h3>
                <p className="step-description">
                  Finish installation
                  <br />& set up
                </p>
              </div>

              <div className="step-item side-step">
                <div className="step-circle">
                  <span className="step-number">3</span>
                </div>
                <h3 className="step-title">Step three</h3>
                <p className="step-description">
                  Enjoy Mods
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InstallationSteps;
