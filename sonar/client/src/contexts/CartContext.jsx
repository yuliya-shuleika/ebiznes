import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existing = prevItems.find((i) => i.ID === item.ID);
            if (existing) {
                return prevItems.map((i) =>
                    i.ID === item.ID ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
        console.log('Item added to cart:', item);

    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.ID !== id));
    };

    const removeOneFromCart = (id) => {
        setCartItems((prevItems) => {
            const existing = prevItems.find((item) => item.ID === id);
            if (existing && existing.quantity > 1) {
                return prevItems.map((item) =>
                    item.ID === id ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }

    const contextValue = useMemo(
        () => ({
            cartItems,
            addToCart,
            removeFromCart,
            removeOneFromCart,
            clearCart,
            getCartTotal,
        }),
        [cartItems]
    );

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useCart = () => useContext(CartContext);
