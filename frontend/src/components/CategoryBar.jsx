import React from 'react';

const categories = [
    "All", "Snacks", "Main Course", "Desserts", "Pizza",
    "Burgers", "Sandwiches", "Drinks", "South Indian",
    "North Indian", "Chinese", "Fast Food", "Cakes",
    "Chole Bhature", "Patties", "Momos"
];

const CategoryBar = ({ selectedCategory, setSelectedCategory }) => {
    return (
        <div style={styles.container}>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                        ...styles.button,
                        backgroundColor: selectedCategory === cat ? '#ff4757' : 'rgba(255,255,255,0.1)',
                        color: selectedCategory === cat ? '#fff' : '#ccc'
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        padding: '1rem 0',
        marginBottom: '2rem',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
    },
    button: {
        padding: '8px 16px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem',
    }
};

export default CategoryBar;
