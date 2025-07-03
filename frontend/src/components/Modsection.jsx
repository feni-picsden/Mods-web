import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/ModsSection.css";
import { createModUrl, createCategorySlug } from "../utils/urlUtils";
import { formatCategoryName } from "../utils/textUtils";
import downloadIcon from "../assets/Downlaod_icon.png";

const ModsSection = ({ title, mods = [] }) => {
  const [displayMods, setDisplayMods] = useState([]);

  useEffect(() => {
    const updateMods = () => {
      const width = window.innerWidth;
      let count = mods.length;
  
      if (width >= 1445 && width <= 1680) {
        count = 6;
      }
  
      if (width >= 1200 && width < 1445) {
        count = 5;
      }
  
      if (mods.length > 0) {
        setDisplayMods(mods.slice(0, count));
      } else {
        setDisplayMods(
          Array(count).fill({
            DisplayImage: "/mod-sample.png",
            Name: "Mod Title",
            Description: "Short description here",
          })
        );
      }
    };
  
    updateMods(); // Run on mount
    window.addEventListener("resize", updateMods); // Run on resize
  
    return () => window.removeEventListener("resize", updateMods);
  }, [mods]);

  let path = "/all";
  if (title === "Browse All") {
    path = "/all";
  } else if (title === "Latest Mods") {
    path = `/all/${createCategorySlug("mods")}`;
  } else if (title === "Popular Mods") {
    path = `/all/${createCategorySlug("mods")}?sortBy=popularity&page=1`;
  } else if (title === "Latest Addon") {
    path = `/all/${createCategorySlug("addon")}`;
  } else if (title === "Popular Addon") {
    path = `/all/${createCategorySlug("addon")}?sortBy=popularity&page=1`;
  } else if (title === "Latest Maps") {
    path = `/all/${createCategorySlug("maps")}`;
  } else if (title === "Popular Maps") {
    path = `/all/${createCategorySlug("maps")}?sortBy=popularity&page=1`;
  } else if (title === "Latest Gun") {
    path = `/all/${createCategorySlug("gun")}`;
  } else if (title === "Popular Gun") {
    path = `/all/${createCategorySlug("gun")}?sortBy=popularity&page=1`;
  }

  return (
    <div className="mods-section">
      <div className="mods-header">
        <h2 className="section-title">{title}</h2>
        <Link to={path} className="view-all">
          View all
        </Link>
      </div>
      <div className="mods-grid">
        {displayMods.map((mod, i) => {
          let modUrl;
          if (mod.Category && mod.Name) {
            modUrl = createModUrl(mod.Category, mod.Name);
          } else {
            modUrl = `/mod/${mod.id}`;
          }

          return (
            <Link 
              to={modUrl}
              className="mod-card-link" 
              key={mod.id || i}
            >
            <div className="mod-card">
              <div className="mod-image-container">
                <img
                  src={mod.DisplayImage || "/mod-sample.png"}
                  alt={mod.Name || "Mod"}
                  className="mod-image"
                />
              </div>
              <div className="mod-info">
                <h3 className="mod-name">
                  {(mod.Name?.length > 20
                    ? mod.Name.slice(0, 20) + "..."
                    : mod.Name) || "Mod Title"}
                </h3>
                <div className="mod-loader">Forge</div>
                <div className="mod-meta">
                  <span className="mod-downloads">
                    <img src={downloadIcon} className="download_icon" alt="download"/> {mod.DownloadCount || "2.9K"}
                  </span>
                  <span className="mod-tag">{formatCategoryName(mod.Category)}</span>
                </div>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ModsSection;
