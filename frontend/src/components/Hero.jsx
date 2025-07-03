import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/Hero.css";
import { createModUrl } from "../utils/urlUtils";
import previousIcon from "../assets/previous.png";
import nextIcon from "../assets/next.png";

const HeroSkeleton = () => (
    <div className="hero-section">
    <div className="hero-title-skeleton shimmer" />
    <div className="hero-subtitle-skeleton shimmer" />
    <div className="carousel-skeleton">
      <div className="slide-item-skeleton shimmer" />
    </div>
    </div>
  );

const TrendingModsSkeleton = () => {
  return (
    <div className="trending-mods-section">
      <div className="trending-content">
        <div className="carousel-title-skeleton shimmer"></div>
        <div className="trending-mods-grid">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="trending-mod-card">
              <div className="hero-image-skeleton shimmer"></div>
              <div className="trending-mod-info">
                <div className="carousel-description-skeleton">
                  <div className="carousel-text-skeleton downloads shimmer"></div>
                  <div className="carousel-text-skeleton likes shimmer"></div>
                  <div className="carousel-text-skeleton version shimmer"></div>
                </div>

                <div className="carousel-stats-container">
                  <div className="carousel-stat-skeleton shimmer"></div>
                  <div className="carousel-stat-skeleton shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-buttons-container">
          <div className="carousel-button-skeleton shimmer"></div>
        </div>
      </div>
    </div>
  );
};

const Hero = ({ trendingMods }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const slidesContainerRef = useRef(null);
  const timerRef = useRef(null);

  const slides = React.useMemo(() => {
    if (!trendingMods || trendingMods.length === 0) return [];
    return [trendingMods[trendingMods.length - 1], ...trendingMods, trendingMods[0]];
  }, [trendingMods]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (slidesContainerRef.current) {
    slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
    }
    setCurrentIndex(prev => prev + 1);
  }, [isTransitioning]);
  
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (slidesContainerRef.current) {
      slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
    }
    setCurrentIndex(prev => prev - 1);
  }, [isTransitioning]);
  
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(nextSlide, 4000);
  }, [nextSlide]);

  useEffect(() => {
    if (!slidesContainerRef.current) return;
    
    const handleTransitionEnd = () => {
              if (currentIndex === slides.length - 1) {
          // We've reached the last cloned slide, jump to first real slide
          setTimeout(() => {
            if (slidesContainerRef.current) {
              // Disable all transitions
              slidesContainerRef.current.classList.add('no-transition');
              slidesContainerRef.current.style.transition = 'none';
              setCurrentIndex(1);
              // Double reflow to ensure the change takes effect
              slidesContainerRef.current.offsetHeight;
              slidesContainerRef.current.offsetWidth;
              
              // Re-enable transitions after a small delay
              setTimeout(() => {
                if (slidesContainerRef.current) {
                  slidesContainerRef.current.classList.remove('no-transition');
                  slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
                  setIsTransitioning(false);
                }
              }, 50);
            }
          }, 10);
        } else if (currentIndex === 0) {
          // We've reached the first cloned slide, jump to last real slide
          setTimeout(() => {
            if (slidesContainerRef.current) {
              // Disable all transitions
              slidesContainerRef.current.classList.add('no-transition');
              slidesContainerRef.current.style.transition = 'none';
              setCurrentIndex(slides.length - 2);
              // Double reflow to ensure the change takes effect
              slidesContainerRef.current.offsetHeight;
              slidesContainerRef.current.offsetWidth;
              
              // Re-enable transitions after a small delay
              setTimeout(() => {
                if (slidesContainerRef.current) {
                  slidesContainerRef.current.classList.remove('no-transition');
                  slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
                  setIsTransitioning(false);
                }
              }, 50);
            }
          }, 10);
      } else {
        setIsTransitioning(false);
      }
    };

    const container = slidesContainerRef.current;
    if (container) {
      container.addEventListener('transitionend', handleTransitionEnd);
      return () => container.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [currentIndex, slides.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, resetTimer]);

  // Initialize carousel on mount
  useEffect(() => {
    if (slidesContainerRef.current && trendingMods && trendingMods.length > 0 && !isInitialized) {
      // Set initial position without transition to prevent flash
      slidesContainerRef.current.style.transition = 'none';
      // Force reflow to ensure no transition on initial render
      slidesContainerRef.current.offsetHeight;
      
      // Enable transitions after mount
      const timer = setTimeout(() => {
        if (slidesContainerRef.current) {
          slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
          setIsInitialized(true);
        }
      }, 200); // Longer delay to ensure stable initial state
      
      return () => clearTimeout(timer);
    }
  }, [trendingMods, isInitialized]);


  
  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (slidesContainerRef.current) {
    slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
    }
    setCurrentIndex(index + 1);
  };

  if (!trendingMods || trendingMods.length === 0) {
    return <HeroSkeleton />;
  }
  
  const getActiveSlideIndex = () => {
    if (currentIndex === 0) return trendingMods.length - 1;
    if (currentIndex === slides.length - 1) return 0;
    return currentIndex - 1;
  };

  return (
    <div className="hero-container">
      <div className="hero-section">
        <h1 className="hero-main-title">Minecraft Mods</h1>
        <p className="hero-main-subtitle">
          Now there are even more ways to change your Bedrock game, your way! <br />
          Explore the new free and paid add-ons at minecraft marketplace today.
        </p>
      <div className="carousel">
        <div
          ref={slidesContainerRef}
          className="slides-container"
            style={{ '--current-index': currentIndex }}
          >
            {slides.map((mod, index) => (
              <div
                key={`${mod.id}-${index}`}
                className={`slide ${index === currentIndex ? 'active' : ''}`}
              >
                <Link to={createModUrl(mod.Category, mod.Name)} className="slide-link">
                  <img
                    src={mod.DisplayImage?.trim ? mod.DisplayImage.trim() : mod.DisplayImage}
                    alt={mod.Name}
                    className="slide-image"
                    fetchpriority={index === 1 ? "high" : "auto"}
                    loading={index === 1 ? "eager" : "lazy"}
                  />
                  <div className="slide-info">
                    <h3 className="slide-title">{mod.Name}</h3>
                    <p className="slide-description">
                      {mod.Description
                        ? (mod.Description.length > 80 
                            ? mod.Description.substring(0, 80) + "..."
                            : mod.Description)
                        : ""}
                    </p>
                  </div>
                </Link>
            </div>
          ))}
        </div>
          <div className="carousel-controls">
            <button className="arrow prev" onClick={prevSlide} disabled={isTransitioning}>
              <img src={previousIcon} alt="Previous" />
            </button>
            <div className="dots">
              {trendingMods.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === getActiveSlideIndex() ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                />
              ))}
            </div>
            <button className="arrow next" onClick={nextSlide} disabled={isTransitioning}>
              <img src={nextIcon} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Hero, TrendingModsSkeleton };
export default Hero;
