import React from 'react';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import './ShopCard.css';

const ShopCard = ({ shop, onClick }) => {
    return (
        <div className="shop-card" onClick={onClick}>
            <div className="shop-card-image-container">
                <img src={shop.image} alt={shop.name} className="shop-card-image" />
                <div className="shop-rating">
                    <FaStar /> {shop.rating || 4.5}
                </div>
            </div>
            <div className="shop-card-content">
                <h3 className="shop-card-title">{shop.name}</h3>
                <div className="shop-card-address">
                    <FaMapMarkerAlt />
                    <span>{shop.address}, {shop.city}</span>
                </div>
                <button className="view-menu-btn">View Menu</button>
            </div>
        </div>
    );
};

export default ShopCard;
