import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Search.css";
import searchIcon from "../assets/Search_icon.png";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    navigate(`/all?search=${encodeURIComponent(trimmedQuery.toLowerCase())}`);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input 
        type="text" 
        placeholder="Search for Minecraft mods..." 
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <div 
        className="search-icon" 
        onClick={handleSearch}
      >
        <img src={searchIcon} alt="search" className="search-iocn-img"/>
      </div>
    </form>
  );
};

export default SearchBar;
