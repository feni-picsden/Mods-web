import React from "react";
import { Link } from "react-router-dom";
import "../styles/Categories.css";
import { createCategorySlug } from "../utils/urlUtils";

const Categories = ({categories}) => {
  return (
    <div className="categories">
      <h2>Popular Categories</h2>
      <div className="category-list-container">
        <div className="category-two-lines">
          <div className="category-line">
            {categories.filter((_, index) => index % 2 === 0).map(cat => (
              <Link 
                key={cat.id} 
                to={`/all/${createCategorySlug(cat.Name)}`}
                className="category-btn"
              >
                <h3><strong>{cat.Name}</strong></h3>
              </Link>
            ))}
          </div>
          
          <div className="category-line">
            {categories.filter((_, index) => index % 2 === 1).map(cat => (
              <Link 
                key={cat.id} 
                to={`/all/${createCategorySlug(cat.Name)}`}
                className="category-btn"
              >
                <h3><strong>{cat.Name}</strong></h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
