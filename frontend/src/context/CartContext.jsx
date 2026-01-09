import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, quantity = 1, forceNew = false) => {
        const itemRestaurant = item.restaurant || 'Foodie Kitchen';

        // Check for restaurant mismatch
        if (!forceNew && cartItems.length > 0) {
            const currentRestaurant = cartItems[0].restaurant || 'Foodie Kitchen';
            if (itemRestaurant !== currentRestaurant) {
                return {
                    success: false,
                    error: 'conflict',
                    currentRestaurant,
                    newRestaurant: itemRestaurant
                };
            }
        }

        let targetCart = forceNew ? [] : cartItems;
        const existItem = targetCart.find((x) => x._id === item._id);

        if (existItem) {
            setCartItems(
                targetCart.map((x) =>
                    x._id === existItem._id ? { ...x, qty: x.qty + quantity } : x
                )
            );
        } else {
            setCartItems([...targetCart, { ...item, qty: quantity, restaurant: itemRestaurant }]);
        }
        return { success: true };
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return; // Don't allow quantity less than 1
        setCartItems(
            cartItems.map((x) =>
                x._id === id ? { ...x, qty: newQty } : x
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
