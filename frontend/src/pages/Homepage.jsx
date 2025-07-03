import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import SearchBar from "../components/Searchbar";
import ModsSection from "../components/Modsection";
import "../styles/Homepage.css";
import AppSection from "../components/AppSection";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";

const TrendingModsSkeleton = () => {
  return (
    <div className="trending-skeleton">
      <div
        className="trending-large-image-skeleton shimmer"
        style={{
          width: "90%",
          height: "300px",
          borderRadius: "12px",
          margin: "0 30px",
        }}
      ></div>
    </div>
  );
};

const CategoriesSkeleton = () => {
  return (
    <div className="categories">
      <div className="categories-title-skeleton shimmer"></div>
      <div className="category-list-container">
        <div className="category-two-lines">
          <div className="category-line">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="category-btn-skeleton shimmer"></div>
            ))}
          </div>

          <div className="category-line">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index + 4}
                className="category-btn-skeleton shimmer"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ModsSectionSkeleton = ({ title }) => {
  return (
    <div className="mods-section">
      <div className="mods-header skeleton-margin">
        <div className="section-title-skeleton shimmer"></div>
        <div className="view-all-skeleton shimmer"></div>
      </div>
      <div className="mods-grid">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="mod-card-skeleton">
            <div className="mod-image-skeleton shimmer"></div>
            <div className="mod-info-skeleton">
              <div className="mod-name-skeleton shimmer"></div>
              <div className="mod-meta-skeleton">
                <div className="mod-downloads-skeleton shimmer"></div>
                <div className="mod-tag-skeleton shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


function Home() {
  const [categories, setCategories] = useState([]);
  const [browseAll, setBrowseAll] = useState([]);
  const [trendingCarousel, setTrendingCarousel] = useState([]);
  
  const [latestMods, setLatestMods] = useState([]);
  const [latestAddons, setLatestAddons] = useState([]);
  const [latestMaps, setLatestMaps] = useState([]);
  const [latestGuns, setLatestGuns] = useState([]);
  
  const [popularMods, setPopularMods] = useState([]);
  const [popularAddons, setPopularAddons] = useState([]);
  const [popularMaps, setPopularMaps] = useState([]);
  const [popularGuns, setPopularGuns] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setCanonicalTag(buildCanonicalUrl("/"));

    const fetchData = async () => {
      setLoadingData(true);
      try {
        const response = await axios.post(
          "http://192.168.29.13:4000/api/mods/home",
          {},
          {
            headers: {
              "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
            },
          }
        );

        if (response.data.status === 200) {
          setTrendingCarousel(response.data.Trending_carousel || []);
          setLatestMods(response.data.Latest_mods || []);
          setLatestAddons(response.data.Latest_addons || []);
          setLatestMaps(response.data.Latest_maps || []);
          setLatestGuns(response.data.Latest_guns || []);

          setPopularMods(response.data.Popular_mods || []);
          setPopularAddons(response.data.Popular_addons || []);
          setPopularMaps(response.data.Popular_maps || []);
          setPopularGuns(response.data.Popular_guns || []);

          setBrowseAll(response.data.Browse_all || []);
          setCategories(response.data.Categories || []);
        }
      } catch (error) {
      } finally {
        setLoadingData(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <main className="main-content">
        {loading ? (
          <div className="hero">
            <div className="hero-content">
              <div className="hero-text">
                <div className="hero-title-skeleton shimmer"></div>
                <div className="hero-description-skeleton">
                  <div className="hero-description-skeleton line-1 shimmer"></div>
                  <div className="hero-description-skeleton line-2 shimmer"></div>
                  <div className="section-content-skeleton shimmer"></div>
                </div>
              </div>
              <TrendingModsSkeleton />
            </div>
          </div>
        ) : (
          <Hero trendingMods={trendingCarousel} />
        )}
      </main>
      <div className="main-content-container">

        <SearchBar />
        {loading ? (
          <>
            <CategoriesSkeleton />
            <ModsSectionSkeleton title="Browse All" />
            <ModsSectionSkeleton title="Latest Mods" />
            <ModsSectionSkeleton title="Popular Mods" />
            <ModsSectionSkeleton title="Latest Addon" />
            <ModsSectionSkeleton title="Popular Addon" />
            <ModsSectionSkeleton title="Latest Maps" />
            <ModsSectionSkeleton title="Popular Maps" />
            <ModsSectionSkeleton title="Latest Gun" />
            <ModsSectionSkeleton title="Popular Gun" />
          </>
        ) : (
          <>
            <Categories categories={categories} />
            <ModsSection title="Browse All" mods={browseAll} />

            {latestMods.length > 0 && (
              <ModsSection title="Latest Mods" mods={latestMods} />
            )}
            {popularMods.length > 0 && (
              <ModsSection
                title="Popular Mods"
                mods={popularMods}
              />
            )}

            {latestAddons.length > 0 && (
              <ModsSection
                title="Latest Addon"
                mods={latestAddons}
              />
            )}
            {popularAddons.length > 0 && (
              <ModsSection
                title="Popular Addon"
                mods={popularAddons}
              />
            )}

            {latestMaps.length > 0 && (
              <ModsSection
                title="Latest Maps"
                mods={latestMaps}
              />
            )}
            {popularMaps.length > 0 && (
              <ModsSection
                title="Popular Maps"
                mods={popularMaps}
              />
            )}

            {latestGuns.length > 0 && (
              <ModsSection
                title="Latest Gun"
                mods={latestGuns}
              />
            )}
            {popularGuns.length > 0 && (
              <ModsSection
                title="Popular Gun"
                mods={popularGuns}
              />
            )}
          </>
        )}
      </div>
      <AppSection />
    </div>
  );
}

export default Home;
