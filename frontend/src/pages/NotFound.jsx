import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";

function NotFound() {
  useEffect(() => {
    setCanonicalTag(buildCanonicalUrl(window.location.pathname));
  }, []);

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-text">
          <h1 className="not-found-404">404</h1>
          <div className="not-found-poem">
            <p>You've ventured too far in the Minecraft land</p>
            <p>This block doesn't exist, like void in your hand</p>
            <p>Perhaps a creeper destroyed what was here</p>
            <p>Let's go back to ModsCraft where mods reappear</p>
          </div>
          <Link to="/" className="home-button">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 