import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Categories.css";
import { createCategorySlug } from "../utils/urlUtils";

const Categories = ({categories}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/all/${createCategorySlug(categoryName)}`);
  };

  return (
    <div className="categories">
      <h2>Popular Categories</h2>
      <div className="category-list-container">
        <div className="category-two-lines">
          <div className="category-line">
            {categories.filter((_, index) => index % 2 === 0).map(cat => (
              <button 
                key={cat.id} 
                className="category-btn"
                onClick={() => handleCategoryClick(cat.Name)}
              >
                <h3> <strong>{cat.Name}</strong></h3>
              </button>
            ))}
          </div>
          
          <div className="category-line">
            {categories.filter((_, index) => index % 2 === 1).map(cat => (
              <button 
                key={cat.id} 
                className="category-btn"
                onClick={() => handleCategoryClick(cat.Name)}
              >
               <h3><strong>{cat.Name}</strong></h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
