import React from 'react';

const categories = [
    { name: "All", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200" },
    { name: "Snacks", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=200" },
    { name: "Main Course", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200" },
    { name: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=200" },
    { name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200" },
    { name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200" },
    { name: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=200" },
    { name: "Drinks", image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?q=80&w=200" },
    { name: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=200" },
    { name: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=200" },
    { name: "Chinese", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=200" },
    { name: "Fast Food", image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=200" },
    { name: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200" },
    { name: "Chole Bhature", image: "https://images.unsplash.com/photo-1710091691802-7dedb8af9a77?q=80&w=200" },
    { name: "Patties", image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=200" },
    { name: "Momos", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=200" }
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
