import React from 'react';

const categories = [
    "All", "Snacks", "Main Course", "Desserts", "Pizza",
    "Burgers", "Sandwiches", "Drinks", "South Indian",
    "North Indian", "Chinese", "Fast Food", "Cakes",
    "Chole Bhature", "Patties", "Momos"
];

import './CategoryBar.css';

const CategoryBar = ({ selectedCategory, setSelectedCategory }) => {
    return (
        <div className="category-bar-container">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryBar;
