import React from 'react';

const categories = [
    { name: "All", image: "https://cdn-icons-png.flaticon.com/512/3211/3211463.png" },
    { name: "Snacks", image: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png" },
    { name: "Main Course", image: "https://cdn-icons-png.flaticon.com/512/1046/1046771.png" },
    { name: "Desserts", image: "https://cdn-icons-png.flaticon.com/512/933/933310.png" },
    { name: "Pizza", image: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png" },
    { name: "Burgers", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
    { name: "Sandwiches", image: "https://cdn-icons-png.flaticon.com/512/2830/2830219.png" },
    { name: "Drinks", image: "https://cdn-icons-png.flaticon.com/512/1187/1187462.png" },
    { name: "South Indian", image: "https://cdn-icons-png.flaticon.com/512/3449/3449392.png" },
    { name: "North Indian", image: "https://cdn-icons-png.flaticon.com/512/2276/2276856.png" },
    { name: "Chinese", image: "https://cdn-icons-png.flaticon.com/512/2619/2619586.png" },
    { name: "Fast Food", image: "https://cdn-icons-png.flaticon.com/512/737/737967.png" },
    { name: "Cakes", image: "https://cdn-icons-png.flaticon.com/512/2682/2682431.png" },
    { name: "Chole Bhature", image: "https://cdn-icons-png.flaticon.com/512/2276/2276931.png" },
    { name: "Patties", image: "https://cdn-icons-png.flaticon.com/512/3081/3081918.png" },
    { name: "Momos", image: "https://cdn-icons-png.flaticon.com/512/1046/1046788.png" }
];

import './CategoryBar.css';

const CategoryBar = ({ selectedCategory, setSelectedCategory }) => {
    return (
        <div className="category-bar-wrapper">
            <div className="category-bar-container">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
                    >
                        <div className="category-img-container">
                            <img src={cat.image} alt={cat.name} className="category-img" />
                        </div>
                        <span className="category-name">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
