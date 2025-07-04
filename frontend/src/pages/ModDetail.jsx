import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/ModDetail.css";
import DownloadButton from "../components/DownloadButton";
import { FaChevronRight } from "react-icons/fa";
import { updateMetaTags } from '../utils/metaUtils';

import appStore from "../assets/appstore.png";
import playStore from "../assets/playstore.png";
import downloadIcon from "../assets/Downlaod_icon.png";
import heartIcon from "../assets/heart_icon.png";
import heartBorderIcon from "../assets/heart_border_icon.png";
import {
  createModUrl,
  createCategorySlug,
  decodeSlug,
  pluralizeCategory,
} from "../utils/urlUtils";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";
import { formatCategoryName, formatModTitle } from "../utils/textUtils";

const RelatedModsSkeleton = () => {
  return (
    <div className="related-mods-section">
      <div className="section-title-skeleton shimmer"></div>
      <div className="related-mods-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="related-mod-card">
            <div className="related-mod-image">
              <div className="related-mod-image-skeleton shimmer"></div>
            </div>
            <div className="related-mod-info">
              <div className="related-mod-title-skeleton shimmer"></div>
              <div className="related-mod-category">
                <div className="related-mod-category-skeleton shimmer"></div>
              </div>
              <div className="related-mod-stats">
                <div className="related-mod-stat-item-skeleton">
                  <div className="related-mod-stat-skeleton downloads shimmer"></div>
                </div>
                <div className="related-mod-stat-item-skeleton">
                  <div className="related-mod-stat-skeleton likes shimmer"></div>
                </div>
              </div>
              <div className="related-mod-version">
                <div className="related-mod-version-skeleton shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className="mod-detail-container">
      <div className="mod-banner"></div>

      <div className="mod-header-dark">
        <div className="breadcrumb-container">
          <div className="breadcrumb-navigation">
            <div className="mod-icon-title-skeleton shimmer"></div>
          </div>
        </div>
      </div>

      <div className="content-container2">
        <div className="mod-title-section">
          <div className="mod-title-content">
            <div className="mod-icon">
              <div className="mod-icon-image-skeleton shimmer"></div>
            </div>
            <div className="mod-title-info">
              <div className="mod-title-skeleton shimmer"></div>
              <div className="mod-stats-skeleton">
                <div className="mod-stat-skeleton first shimmer"></div>
                <div className="mod-stat-skeleton shimmer"></div>
              </div>
              <div className="mod-category-skeleton">
                <div className="mod-category-display-skeleton shimmer"></div>
              </div>
            </div>
            <div className="mod-actions-skeleton">
              <div className="heart-button-skeleton shimmer"></div>
              <div className="action-buttons-skeleton">
                <div className="download-button-skeleton shimmer"></div>
                <div className="install-button-skeleton shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mod-two-column-layout">
          <div className="mod-left-column">
            <div className="mod-section mod-description-section">
              <div className="section-title-skeleton shimmer"></div>

              <div className="mod-carousel-section">
                <div className="mod-main-image-container">
                  <div className="mod-main-image-skeleton shimmer"></div>
                </div>

                <div className="mod-thumbnails">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="thumbnail-container-skeleton">
                      <div className="mod-thumbnail-skeleton shimmer"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mod-description-text-skeleton-container">
                <div className="mod-description-text-skeleton line-1 shimmer"></div>
                <div className="mod-description-text-skeleton line-2 shimmer"></div>
                <div className="mod-description-text-skeleton line-3 shimmer"></div>
                <div className="mod-description-text-skeleton line-4 shimmer"></div>
              </div>
              <div className="mod-controls-section">
                <div className="controls-title-skeleton shimmer"></div>
                <div className="control-list-skeleton">
                  <div className="control-item-skeleton shimmer"></div>
                  <div className="control-item-skeleton shimmer"></div>
                  <div className="control-item-skeleton shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mod-right-column">
            <div className="mod-section about-project-section">
              <div className="about-section-title-skeleton shimmer"></div>
              <div className="project-details">
                <div className="project-detail-item">
                  <div className="about-detail-skeleton created shimmer"></div>
                  <div className="about-detail-value-skeleton shimmer"></div>
                </div>
                <div className="project-detail-item">
                  <div className="about-detail-skeleton shimmer"></div>
                  <div className="about-detail-value-skeleton shimmer"></div>
                </div>
                <div className="project-detail-item">
                  <div className="about-detail-skeleton version shimmer"></div>
                  <div className="about-detail-value-skeleton shimmer"></div>
                </div>
              </div>
            </div>

            <div className="mod-section mod-loaders-section">
              <div className="loaders-section-title-skeleton shimmer"></div>
              <div className="loaders-list-skeleton">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="loader-tag-skeleton shimmer"
                  ></div>
                ))}
              </div>
            </div>

            <div className="mod-section categories-section">
              <div className="categories-section-title-skeleton shimmer"></div>
              <div className="categories-list-skeleton">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="category-tag-skeleton shimmer"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="also-available-section">
          <div className="download-section-title-skeleton shimmer"></div>
          <div className="app-download-buttons-skeleton">
            <div className="app-button-skeleton shimmer"></div>
            <div className="app-button-skeleton shimmer"></div>
          </div>
        </div>
      </div>

      <RelatedModsSkeleton />
    </div>
  );
};

function ModDetail() {
  const params = useParams();
  const { id, category, modTitle } = params;
  const navigate = useNavigate();
  const [mod, setMod] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedMods, setRelatedMods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);
  const [likeStatus, setLikeStatus] = useState(null);

  useEffect(() => {
    const fetchModDetail = async () => {
      setLoading(true);
      setError(null);
      setLikeStatus(null);
      setActiveImage(0);

      try {
        let response;

        if (category && modTitle) {
          response = await axios.post(
            "http://192.168.29.13:4000/api/mods/getModBySlug",
            {
              category: decodeURIComponent(category),
              modTitle: decodeURIComponent(modTitle),
            },
            {
              headers: {
                "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
              },
            }
          );
        } else if (id) {
          response = await axios.post(
            "http://192.168.29.13:4000/api/mods/getModDetail",
            { id },
            {
              headers: {
                "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
              },
            }
          );
        } else {
          throw new Error("No valid parameters provided");
        }

        if (response.data.status === 200) {
          setMod(response.data.mod);
          setCategories(response.data.Categories);
          setRelatedMods(response.data.RelatedMods || []);
          const modName = response.data.mod.Name;
          const modCategory = response.data.mod.Category;
          document.title = `${modName} - ${modCategory} for Minecraft`;

          if (category && modTitle) {
            setCanonicalTag(buildCanonicalUrl(`/all/${category}/${modTitle}`));
          } else if (id) {
            setCanonicalTag(buildCanonicalUrl(`/mod/${id}`));
          }

          if (
            response.data.mod.SubImages &&
            response.data.mod.SubImages.length > 0
          ) {
            setActiveImage(0);
          }

          // Update meta tags with dynamic mod information including image
          if (response.data.mod) {
            updateMetaTags(
              `${response.data.mod.Name} - Minecraft Mod Download | ModsCraft`,
              `Download ${response.data.mod.Name} mod for Minecraft. ${response.data.mod.Description?.slice(0, 150)}...`,
              response.data.mod.DisplayImage // Pass the display image for social sharing
            );
          }
        } else {
          setError("Failed to load mod details");
        }

        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching mod details");
        setLoading(false);
      }
    };

    fetchModDetail();
  }, [id, category, modTitle]);

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  const nextImage = () => {
    if (mod && mod.SubImages) {
      setActiveImage((prev) =>
        prev >= mod.SubImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (mod && mod.SubImages) {
      setActiveImage((prev) =>
        prev === 0 ? mod.SubImages.length - 1 : prev - 1
      );
    }
  };

  const handleLike = async () => {
    if (!mod) return;

    try {
      if (likeStatus === "liked") {
        setLikeStatus(null);

        setMod((prev) => ({
          ...prev,
          Likes: String(Math.max(0, parseInt(prev.Likes) - 1)),
        }));

        const response = await axios.post(
          "http://192.168.29.13:4000/api/mods/dislike",
          { id: mod.id },
          {
            headers: {
              "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
            },
          }
        );

        if (response.data.status !== 200) {
          setLikeStatus("liked");
          setMod((prev) => ({
            ...prev,
            Likes: String(parseInt(prev.Likes) + 1),
          }));
        }
      } else {
        setLikeStatus("liked");

        setMod((prev) => ({
          ...prev,
          Likes: String(parseInt(prev.Likes) + 1),
        }));

        const response = await axios.post(
          "http://192.168.29.13:4000/api/mods/increaseLikes",
          { id: mod.id },
          {
            headers: {
              "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
            },
          }
        );

        if (response.data.status !== 200) {
          setLikeStatus(null);
          setMod((prev) => ({
            ...prev,
            Likes: String(Math.max(0, parseInt(prev.Likes) - 1)),
          }));
        }
      }
    } catch (error) {
      if (likeStatus === "liked") {
        setLikeStatus(null);
        setMod((prev) => ({
          ...prev,
          Likes: String(parseInt(prev.Likes) + 1),
        }));
      } else {
        setLikeStatus("liked");
        setMod((prev) => ({
          ...prev,
          Likes: String(Math.max(0, parseInt(prev.Likes) - 1)),
        }));
      }
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!mod) {
    return <div className="error">Mod not found</div>;
  }

  const cleanImageUrl = (url) => {
    return url.replace(/`/g, "").trim();
  };

  const formatDate = (timestamp) => {
    const dateFromString = new Date(timestamp);
    if (!isNaN(dateFromString) && isNaN(Number(timestamp))) {
      return dateFromString.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    const numTimestamp = parseInt(timestamp);
    const date =
      numTimestamp.toString().length <= 10
        ? new Date(numTimestamp * 1000)
        : new Date(numTimestamp);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mod-detail-container">
      <div className="mod-banner"></div>

      <div className="mod-header-dark">
        <div className="breadcrumb-container">
          <div className="breadcrumb-navigation">
            <Link to="/" className="breadcrumb-item">
              Home
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
            <Link to="/all" className="breadcrumb-item">
              All
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
            <Link
              to={`/all/${createCategorySlug(mod.Category)}`}
              className="breadcrumb-item"
            >
              {pluralizeCategory(mod.Category)}
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-item current">
              {formatModTitle(mod.Name)}
            </span>
          </div>
        </div>
      </div>

      <div className="content-container2">
        <div className="mod-title-section">
          <div className="mod-title-content">
            <div className="mod-icon">
              <img
                src={cleanImageUrl(mod.DisplayImage)}
                alt={mod.Name}
                className="mod-icon-image"
              />
            </div>
            <div className="mod-title-info">
              <h1 className="mod-title">{mod.Name}</h1>
              <div className="mod-meta-info">
                <div className="mod-stats">
                  <span className="stat-item">
                    <img
                      src={downloadIcon}
                      alt="download"
                      className="stat-icon-img"
                    />
                    {parseInt(mod.DownloadCount).toLocaleString()}
                  </span>
                  <span className="stat-item">
                    <img
                      src={heartIcon}
                      alt="likes"
                      className="stat-icon-img"
                    />
                    {parseInt(mod.Likes || 0).toLocaleString()}
                  </span>

                  {mod.Category && (
                    <div className="mod-category-display">
                      <Link
                        to={`/all/${createCategorySlug(mod.Category)}`}
                        className="category-tag"
                      >
                        {formatCategoryName(mod.Category)}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mod-actions">
              <div className="mod-like-buttons">
                <button
                  className={`heart-button ${
                    likeStatus === "liked" ? "liked" : ""
                  }`}
                  onClick={handleLike}
                >
                  {likeStatus === "liked" ? (
                    <img src={heartIcon} alt="heart" />
                  ) : (
                    <img src={heartBorderIcon} alt="heart" />
                  )}
                </button>
              </div>
              <div className="action-buttons">
                <DownloadButton id={mod.id} />
                <button
                  className="install-button"
                  onClick={() => navigate("/installation-steps")}
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mod-two-column-layout">
          <div className="mod-left-column">
            <div className="mod-section mod-description-section">
              <h2 className="section-title">Description</h2>

              <div className="mod-carousel-section">
                <div className="mod-main-image-container">
                  <img
                    src={cleanImageUrl(mod.SubImages[activeImage])}
                    alt={`${mod.Name} screenshot ${activeImage + 1}`}
                    className="mod-main-image"
                  />
                  <button className="carousel-arrow prev" onClick={prevImage}>
                    &lt;
                  </button>
                  <button className="carousel-arrow next" onClick={nextImage}>
                    &gt;
                  </button>
                  <div className="image-counter">
                    {activeImage + 1}/{mod.SubImages.length}
                  </div>
                </div>

                <div className="mod-thumbnails">
                  {mod.SubImages &&
                    mod.SubImages.map((image, index) => (
                      <div
                        key={index}
                        className={`thumbnail-container ${
                          index === activeImage ? "active" : ""
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          src={cleanImageUrl(image)}
                          alt={`${mod.Name} thumbnail ${index + 1}`}
                          className="thumbnail-image"
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="mod-description-text">
                <p>{mod.Description}</p>
              </div>
            </div>
          </div>

          <div className="mod-right-column">
            <div className="mod-section about-project-section">
              <h3 className="section-title">About Project</h3>
              <div className="project-details">
                <div className="project-detail-item">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">
                    {formatDate(mod.CreatedDate)}
                  </span>
                </div>
                <div className="project-detail-item">
                  <span className="detail-label">Updated</span>
                  <span className="detail-value">
                    {formatDate(mod.UpdatedDate)}
                  </span>
                </div>
                <div className="project-detail-item">
                  <span className="detail-label">Game Version</span>
                  <span className="detail-value">{mod.Version}</span>
                </div>
              </div>
            </div>

            {mod.Loaders && (
              <div className="mod-section mod-loaders-section">
                <h3 className="section-title">Mod Loaders</h3>
                <div className="loaders-list">
                  {mod.Loaders.split(",").map((loader, index) => (
                    <div key={index} className="loader-item">
                      {loader.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mod-section categories-section mod-detail-category">
              <h3 className="section-title">Categories</h3>
              <div className="categories-list">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="category-item"
                    onClick={() =>
                      navigate(`/all/${createCategorySlug(category.Name)}`)
                    }
                  >
                    {formatCategoryName(category.Name)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <RelatedModsSkeleton />
        ) : (
          relatedMods &&
          relatedMods.length > 0 && (
            <div className="related-mods-section">
              <h3 className="section-title">
                Related {pluralizeCategory(mod.Category)}
              </h3>
              <div className="related-mods-grid">
                {relatedMods.map((relatedMod) => (
                  <div key={relatedMod.id} className="related-mod-card">
                    <Link
                      to={
                        relatedMod.Category && relatedMod.Name
                          ? createModUrl(relatedMod.Category, relatedMod.Name)
                          : `/mod/${relatedMod.id}`
                      }
                      className="related-mod-link"
                    >
                      <div className="related-mod-image">
                        <img
                          src={cleanImageUrl(relatedMod.DisplayImage)}
                          alt={relatedMod.Name}
                          className="related-mod-img"
                        />
                      </div>
                      <div className="related-mod-info">
                        <h4 className="related-mod-title">{relatedMod.Name}</h4>
                        <div className="related-mod-category">
                          <span className="category-tag-small">
                            {formatCategoryName(relatedMod.Category)}
                          </span>
                        </div>
                        <div className="related-mod-stats">
                          <span className="stat-item-small">
                            <img
                              src={downloadIcon}
                              alt="downloads"
                              className="stat-icon-small"
                            />
                            {parseInt(
                              relatedMod.DownloadCount
                            ).toLocaleString()}
                          </span>
                          <span className="stat-item-small">
                            <img
                              src={heartIcon}
                              alt="likes"
                              className="stat-icon-small"
                            />
                            {parseInt(relatedMod.Likes || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="related-mod-version">
                          <span className="version-badge-small">
                            {relatedMod.Version}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        <div className="also-available-section">
          <h3 className="section-title">Also Available on this Apps</h3>
          <div className="app-download-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.mods.minecraft.mc.pe.addons.shader"
              target="_blank"
              className="app-button google-play"
            >
              <img src={playStore} alt="Get it on Google Play" />
            </a>
            <a
              href="https://apps.apple.com/app/addons-skin-for-minecraft-pe/id1636851298"
              target="_blank"
              className="app-button app-store"
            >
              <img src={appStore} alt="Download on the App Store" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModDetail;
