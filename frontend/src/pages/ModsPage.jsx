import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  useSearchParams,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import "../styles/ModsPage.css";
import {
  createModUrl,
  createCategorySlug,
  decodeSlug,
  pluralizeCategory,
} from "../utils/urlUtils";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import playStore from "../assets/playstore.png";
import appStore from "../assets/appstore.png";
import searchIcon from "../assets/Search_icon.png";
import downloadIcon from "../assets/Downlaod_icon.png";
import heartIcon from "../assets/heart_icon.png";
import versionIcon from "../assets/version_icon.png";
import { setCanonicalTag, buildCanonicalUrl } from "../utils/canonicalUtils";
import { formatCategoryName, compareCategoryNames } from "../utils/textUtils";
import { updateMetaTags } from '../utils/metaUtils';

const ModItemSkeleton = () => {
  return (
    <div className="mod-item-skeleton">
      <div className="mod-item-link">
        <div className="mod-icon-skeleton shimmer"></div>
        <div className="mod-info">
          <div className="mod-title-skeleton shimmer"></div>
          <div className="mod-stats-skeleton">
            <div className="stat-skeleton shimmer"></div>
            <div className="stat-skeleton shimmer"></div>
            <div className="version-skeleton shimmer"></div>
            <div className="loaders-skeleton">
              <div className="loaders-label-skeleton shimmer"></div>
            </div>
          </div>
          <div className="mod-tags-skeleton">
            <div className="tag-skeleton shimmer"></div>
            <div className="tag-skeleton shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModsListSkeleton = () => {
  return (
    <div className="mods-list">
      {Array.from({ length: 10 }, (_, index) => (
        <ModItemSkeleton key={index} />
      ))}
    </div>
  );
};

const HeaderSkeleton = () => {
  return (
    <div className="mods-page-header">
      <div className="header-top-section">
        <div className="breadcrumb-section">
          <div className="breadcrumb-skeleton shimmer"></div>
        </div>
        <div className="page-title-inline">
          <div className="page-title-skeleton shimmer"></div>
          <div className="page-subtitle-skeleton shimmer"></div>
        </div>
      </div>
      <div className="page-title-section">
        <div className="page-description-skeleton"></div>
      </div>
    </div>
  );
};

const SidebarSkeleton = () => {
  return (
    <div className="mods-sidebar">
      <div className="sidebar-section skeleton-padding">
        <div className="sidebar-title-skeleton shimmer"></div>
        <div className="categories-list">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="category-item-skeleton shimmer"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchSectionSkeleton = () => {
  return (
    <div className="search-section">
      <div className="search-bar">
        <div className="search-input-skeleton shimmer"></div>
      </div>
    </div>
  );
};

const FilterControlsSkeleton = () => {
  return (
    <div className="filter-controls-bar ">
      <div className="filter-left">
        <div className="filter-group">
          <div className="filter-label-skeleton sort shimmer"></div>
          <div className="filter-select-skeleton sort shimmer"></div>
        </div>
      </div>
      <div className="filter-right">
        <div className="filter-group page-group">
          <div className="filter-label-skeleton page shimmer"></div>
          <div className="filter-select-skeleton page shimmer"></div>
        </div>
        <div className="pagination-info">
          <div className="pagination-skeleton">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="page-num-skeleton shimmer"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RightSidebarSkeleton = () => {
  return (
    <div className="right-sidebar">
      <div className="sidebar-section skeleton-padding">
        <div className="sidebar-title-skeleton shimmer"></div>
        <div className="subcategories-list">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="subcategory-item-skeleton">
              <div className="subcategory-checkbox-skeleton shimmer"></div>
              <div className="subcategory-label-skeleton shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NoDataFound = () => {
  return (
    <div className="no-data-container">
      <div className="no-data-content">
        <div className="no-data-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
            <path d="M11 8v6"></path>
            <path d="M8 11h6"></path>
          </svg>
        </div>
        <h3 className="no-data-title">No Content Found</h3>
        <p className="no-data-message">
          We couldn't find any content matching your current filters.
        </p>
        <div className="no-data-suggestions">
          <p>Try:</p>
          <ul>
            <li>Removing some filters</li>
            <li>Changing your search terms</li>
            <li>Browsing different categories</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className="mods-page-container">
      <div className="mod-banner"></div>
      <HeaderSkeleton />

      <div className="mods-main-content">
        <SidebarSkeleton />

        <div className="mods-content-area">
          <SearchSectionSkeleton />

          <div className="content-with-sidebar">
            <div className="mods-main-area">
              <FilterControlsSkeleton />
              <ModsListSkeleton />
            </div>
            <RightSidebarSkeleton />
          </div>
        </div>
      </div>

      <div className="also-available-section">
        <div className="section-title-skeleton shimmer"></div>
        <div className="app-download-buttons">
          <div className="app-button-skeleton first shimmer"></div>
          <div className="app-button-skeleton second shimmer"></div>
        </div>
      </div>
    </div>
  );
};

function ModsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [mods, setMods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modsLoading, setModsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory ? decodeSlug(urlCategory) : ""
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    searchParams.get("subcategories")
      ? searchParams.get("subcategories").split(",").filter(Boolean)
      : []
  );
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "latest_update"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(searchParams.get("limit")) || 20
  );

  // Update page title when category changes
  useEffect(() => {
    if (selectedCategory) {
      document.title = `${pluralizeCategory(
        formatCategoryName(selectedCategory)
      )} for Minecraft`;
    } else {
      document.title = "All Minecraft Mods";
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    const categoryFromUrl = urlCategory ? decodeSlug(urlCategory) : "";
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
      setSelectedSubcategories([]);
      setCurrentPage(1);
    }
  }, [urlCategory]);

  useEffect(() => {
    const search = searchParams.get("search");
    const sortByParam = searchParams.get("sortBy");
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const limitParam = parseInt(searchParams.get("limit")) || 20;
    const subcategoriesParam = searchParams.get("subcategories")
      ? searchParams.get("subcategories").split(",").filter(Boolean)
      : [];

    // Only update search query from URL if it's different from debounced query (not the typing query)
    if (search !== debouncedSearchQuery) {
      setSearchQuery(search || "");
      setDebouncedSearchQuery(search || "");
      return;
    }

    if (sortByParam && sortByParam !== sortBy) {
      setSortBy(sortByParam);
      return;
    }

    if (pageParam !== currentPage) {
      setCurrentPage(pageParam);
      return;
    }

    if (limitParam !== itemsPerPage) {
      setItemsPerPage(limitParam);
      setCurrentPage(1);
      return;
    }

    // Check if subcategories from URL are different from current state
    const subcategoriesChanged =
      JSON.stringify(subcategoriesParam.sort()) !==
      JSON.stringify(selectedSubcategories.sort());
    if (subcategoriesChanged) {
      setSelectedSubcategories(subcategoriesParam);
      return;
    }

    if (selectedCategory) {
      fetchFilteredMods();
    } else {
      fetchAllMods();
    }
  }, [searchParams, selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      fetchFilteredMods();
    } else {
      fetchAllMods();
    }
  }, [
    selectedCategory,
    selectedSubcategories,
    currentPage,
    sortBy,
    debouncedSearchQuery,
    itemsPerPage,
  ]);

  useEffect(() => {
    let canonicalPath = "/all";

    if (selectedCategory) {
      canonicalPath = `/all/${createCategorySlug(selectedCategory)}`;
    }

    const queryParams = new URLSearchParams();
    if (debouncedSearchQuery)
      queryParams.set("search", debouncedSearchQuery.toLowerCase());
    if (selectedSubcategories.length > 0)
      queryParams.set(
        "subcategories",
        selectedSubcategories.map((sub) => sub.toLowerCase()).join(",")
      );
    if (currentPage > 1) queryParams.set("page", currentPage.toString());
    if (sortBy !== "latest_update")
      queryParams.set("sortBy", sortBy.toLowerCase());
    if (itemsPerPage !== 20) queryParams.set("limit", itemsPerPage.toString());

    const queryString = queryParams.toString();
    const fullCanonicalPath = queryString
      ? `${canonicalPath}?${queryString}`
      : canonicalPath;

    setCanonicalTag(buildCanonicalUrl(fullCanonicalPath));
  }, [
    selectedCategory,
    selectedSubcategories,
    currentPage,
    sortBy,
    debouncedSearchQuery,
    itemsPerPage,
  ]);

  const fetchHomeData = async () => {
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
        setCategories(response.data.Categories || []);
      }
    } catch (error) {
      setError("Failed to load categories");
    }
    setLoading(false);
  };

  const fetchAllMods = async () => {
    setModsLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.29.13:4000/api/mods",
        {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy,
          search: debouncedSearchQuery,
        },
        {
          headers: {
            "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
          },
        }
      );
      if (response.data.status === 200) {
        setMods(response.data.mods);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        setMeta(response.data.meta);
        if (response.data.meta) {
          updateMetaTags(response.data.meta.title, response.data.meta.description);
        }
      }
    } catch (error) {
      setError("Failed to load mods");
    } finally {
      setModsLoading(false);
    }
  };

  const fetchFilteredMods = async () => {
    setModsLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.29.13:4000/api/mods/filterModsByCategoryAndSubcategory",
        {
          category: urlCategory,
          subcategories: selectedSubcategories,
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy,
          search: debouncedSearchQuery,
        },
        {
          headers: {
            "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
          },
        }
      );
      if (response.data.status === 200) {
        setMods(response.data.mods);
        if (response.data.AllSubcategories) {
          setSubcategories(response.data.AllSubcategories || []);
        }
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        setMeta(response.data.meta);
        if (response.data.meta) {
          updateMetaTags(response.data.meta.title, response.data.meta.description);
        }
      }
    } catch (error) {
      setError(
        `Failed to fetch mods for category: ${selectedCategory || "all"}`
      );
    } finally {
      setModsLoading(false);
    }
  };
  const storeSearchKeyword = async (keyword) => {
    try {
      await axios.post(
        "http://192.168.29.13:4000/api/mods/storeSearchKeyword",
        {
          keyword: keyword,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
          },
        }
      );
    } catch (error) {
      console.error("Error storing search keyword:", error);
    }
  };

  const handleSearchExecution = async (query) => {
    const trimmedQuery = query.trim();

    const newParams = new URLSearchParams(searchParams);

    if (!trimmedQuery) {
      setDebouncedSearchQuery("");
      newParams.delete("search");
      newParams.set("page", "1");
      setSearchParams(newParams);
      return;
    }

    try {
      await storeSearchKeyword(trimmedQuery);
      setDebouncedSearchQuery(trimmedQuery);
      newParams.set("search", trimmedQuery);
      newParams.set("page", "1");
      setSearchParams(newParams);
    } catch (error) {
      console.error("Search execution error:", error);
      setDebouncedSearchQuery(trimmedQuery);
      newParams.set("search", trimmedQuery);
      newParams.set("page", "1");
      setSearchParams(newParams);
    }
  };

  const handleCategorySelect = (categoryName) => {
    const categorySlug = createCategorySlug(categoryName);
    navigate(`/all/${categorySlug}`);
  };

  const handleSubcategoryToggle = (subcategoryName) => {
    const newParams = new URLSearchParams(searchParams);

    setSelectedSubcategories((prev) => {
      const newSubcategories = prev.includes(subcategoryName)
        ? prev.filter((sub) => sub !== subcategoryName)
        : [...prev, subcategoryName];

      if (newSubcategories.length > 0) {
        newParams.set("subcategories", newSubcategories.join(","));
      } else {
        newParams.delete("subcategories");
      }
      setSearchParams(newParams);
      return newSubcategories;
    });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategories([]);
    setSubcategories([]);
    setCurrentPage(1);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    const newParams = new URLSearchParams();
    if (
      searchParams.get("sortBy") &&
      searchParams.get("sortBy") !== "latest_update"
    ) {
      newParams.set("sortBy", searchParams.get("sortBy"));
    }
    if (searchParams.get("limit") && searchParams.get("limit") !== "20") {
      newParams.set("limit", searchParams.get("limit"));
    }
    newParams.set("page", "1");
    const queryString = newParams.toString();
    navigate(`/all${queryString ? `?${queryString}` : ""}`);
  };
  const formatDate = (timestamp) => {
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
  const cleanImageUrl = (url) => {
    return url?.replace(/`/g, "").trim() || "";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
    // Add smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="mods-page-container">
      <div className="mod-banner"></div>
      <div className="mods-page-header">
        <div className="header-top-section">
          <div className="breadcrumb-section">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
            {selectedCategory ? (
              <Link
                to="/all"
                className="breadcrumb-link"
                onClick={() => {
                  clearFilters();
                }}
              >
                All
              </Link>
            ) : (
              <span className="breadcrumb-current">All</span>
            )}
            {selectedCategory && (
              <>
                <FaChevronRight className="breadcrumb-separator" />
                <span className="breadcrumb-current">
                  {pluralizeCategory(formatCategoryName(selectedCategory))}
                </span>
              </>
            )}
          </div>
          <div className="page-title-inline">
            <h1 className="page-title">
              {selectedCategory
                ? "Minecraft " +
                  pluralizeCategory(formatCategoryName(selectedCategory))
                : "All Minecraft Content"}
            </h1>
            <span className="page-subtitle">
              {totalItems?.toLocaleString()} item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="mods-main-content">
        <div className="mods-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="categories-list">
              <div
                className={`category-item ${!selectedCategory ? "active" : ""}`}
                onClick={() => clearFilters()}
              >
                All
              </div>
              {categories.map((category) => {
                return (
                  <div
                    key={category.id}
                    className={`category-item ${
                      compareCategoryNames(selectedCategory, category.Name)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategorySelect(category.Name)}
                  >
                    {formatCategoryName(category.Name)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mods-content-area">
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for Minecraft content..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchExecution(searchQuery);
                  }
                }}
                className="search-input-main"
              />
              <div
                className="search-icon clickable"
                onClick={() => {
                  handleSearchExecution(searchQuery);
                }}
              >
                <img
                  src={searchIcon}
                  alt="search"
                  className="search-iocn-img"
                />
              </div>
            </div>
            {(selectedCategory || selectedSubcategories.length > 0) && (
              <div className="active-filters">
                <div className="filter-tags">
                  {selectedCategory && (
                    <div className="filter-tag category-tag">
                      <span>
                        {pluralizeCategory(
                          formatCategoryName(selectedCategory)
                        )}
                      </span>
                      <button
                        onClick={() => clearFilters()}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedSubcategories.map((subcategory) => (
                    <div
                      key={subcategory}
                      className="filter-tag subcategory-tag"
                    >
                      <span>{subcategory}</span>
                      <button
                        onClick={() => handleSubcategoryToggle(subcategory)}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {(selectedCategory || selectedSubcategories.length > 0) && (
                  <button onClick={clearFilters} className="clear-all-filters">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
            {/* <HorizontalAd /> */}
          </div>
          <div className="content-with-sidebar">
            <div className="mods-main-area">
              <div className="filter-controls-bar">
                <div className="filter-left">
                  <div className="filter-group">
                    <label>Sort by:</label>
                    <div className="select-wrapper">
                      <select
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          setCurrentPage(1);
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set("sortBy", e.target.value);
                          newParams.set("page", "1");
                          setSearchParams(newParams);
                        }}
                        className="filter-select"
                      >
                        <option value="latest_update">Latest update</option>
                        <option value="relevancy">Relevancy</option>
                        <option value="popularity">Popularity</option>
                        <option value="creation_date">Creation Date</option>
                        <option value="total_downloads">Total Downloads</option>
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                  </div>
                </div>

                <div className="filter-right">
                  <div className="filter-group page-group">
                    <label>Show per page:</label>
                    <div className="select-wrapper">
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(parseInt(e.target.value));
                          setCurrentPage(1);
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set("limit", e.target.value);
                          newParams.set("page", "1");
                          setSearchParams(newParams);
                        }}
                        className="filter-select"
                      >
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="60">60</option>
                        <option value="100">100</option>
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                  </div>
                  <div className="pagination-info">
                    <span className="page-numbers">
                      {currentPage > 1 && (
                        <button
                          className="page-arrow"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          &lt;
                        </button>
                      )}

                      {currentPage > 2 && (
                        <button
                          className="page-num"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                      )}
                      {currentPage > 3 && (
                        <span className="page-ellipsis">...</span>
                      )}

                      {currentPage > 1 && (
                        <button
                          className="page-num"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          {currentPage - 1}
                        </button>
                      )}

                      <button className="page-num active">{currentPage}</button>

                      {currentPage < totalPages && (
                        <button
                          className="page-num"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          {currentPage + 1}
                        </button>
                      )}

                      {currentPage < totalPages - 2 && (
                        <span className="page-ellipsis">...</span>
                      )}
                      {currentPage < totalPages - 1 && (
                        <button
                          className="page-num"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      )}

                      {currentPage < totalPages && (
                        <button
                          className="page-arrow"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          &gt;
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {modsLoading ? (
                <ModsListSkeleton />
              ) : mods.length === 0 ? (
                <NoDataFound />
              ) : (
                <div className="mods-list">
                  {mods.map((mod) => (
                    <div key={mod.id} className="mod-item">
                      <Link
                        to={
                          mod.Category && mod.Name
                            ? createModUrl(mod.Category, mod.Name)
                            : `/mod/${mod.id}`
                        }
                        className="mod-item-link"
                      >
                        <div className="mod-info-container">
                          <div className="mod-icon">
                            <img
                              src={cleanImageUrl(mod.DisplayImage)}
                              alt={mod.Name}
                              className="mod-image"
                            />
                          </div>
                          <div className="mod-info">
                            <h3 className="mod-title">{mod.Name}</h3>
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
                              <span className="stat-item">
                                <img
                                  src={versionIcon}
                                  alt="version"
                                  className="stat-icon-img"
                                />
                                {mod.Version}
                              </span>
                              {mod.Loaders && (
                                <span className="stat-item loaders-item">
                                  <span className="loaders-list-inline">
                                    {mod.Loaders.split(",").map(
                                      (loader, index) => (
                                        <span
                                          key={index}
                                          className="loader-badge"
                                        >
                                          {loader.trim()}
                                        </span>
                                      )
                                    )}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mod-tags">
                          <span className="tag category-tag">
                            {formatCategoryName(mod.Category1)}
                          </span>
                          {mod.SubCategory1 && (
                            <span className="tag subcategory-tag">
                              {mod.SubCategory1[0].toUpperCase() +
                                mod.SubCategory1.substring(1)}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              <div className="pagination-info pagination-end">
                <span className="page-numbers">
                  {currentPage > 1 && (
                    <button
                      className="page-arrow "
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      &lt;
                    </button>
                  )}

                  {currentPage > 2 && (
                    <button
                      className="page-num"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  )}
                  {currentPage > 3 && (
                    <span className="page-ellipsis">...</span>
                  )}

                  {currentPage > 1 && (
                    <button
                      className="page-num"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </button>
                  )}

                  <button className="page-num active">{currentPage}</button>

                  {currentPage < totalPages && (
                    <button
                      className="page-num"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </button>
                  )}

                  {currentPage < totalPages - 2 && (
                    <span className="page-ellipsis">...</span>
                  )}
                  {currentPage < totalPages - 1 && (
                    <button
                      className="page-num"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}

                  {currentPage < totalPages && (
                    <button
                      className="page-arrow"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      &gt;
                    </button>
                  )}
                </span>
              </div>
            </div>

            {selectedCategory && subcategories.length > 0 && (
              <div className="right-sidebar">
                <div className="sidebar-section">
                  <h3 className="sidebar-title">Subcategories</h3>
                  <div className="subcategories-list">
                    {subcategories.map((subcategory, index) => (
                      <label
                        key={subcategory.Name || index}
                        className={`subcategory-item ${
                          selectedSubcategories.includes(subcategory.Name)
                            ? "selected"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(
                            subcategory.Name
                          )}
                          onChange={() =>
                            handleSubcategoryToggle(subcategory.Name)
                          }
                          className="subcategory-checkbox"
                        />
                        <span className="subcategory-label">
                          {formatCategoryName(subcategory.Name)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
  );
}

export default ModsPage;
