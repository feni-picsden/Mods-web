import React from "react";
import "../styles/AppSection.css";
import playStore from "../assets/playstore.png";
import appStore from "../assets/appstore.png";

const AppSection = () => {
  return (
    <div className="app-download-container">
      <h2 className="app-download-heading">Also Available on this Apps</h2>
      <div className="app-buttons">
        <a href="https://play.google.com/store/apps/details?id=com.mods.minecraft.mc.pe.addons.shader" target="_blank" rel="noopener noreferrer">
          <img
            src={playStore}
            alt="Get it on Google Play"
            className="store-badge"
          />
        </a>
        <a href="https://apps.apple.com/app/addons-skin-for-minecraft-pe/id1636851298" target="_blank" rel="noopener noreferrer">
          <img
            src={appStore}
            alt="Download on the App Store"
            className="store-badge"
          />
        </a>
      </div>
    </div>
  );
};

export default AppSection;
