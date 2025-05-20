import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart from './Cart';
import { useCart } from './contexts/CartContext';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

//10 assertions
jest.mock('./contexts/CartContext');
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

jest.mock('./CartItem', () => {
    const MockCartItem = ({ cartItemId }) => (
        <li data-testid={`cart-item-${cartItemId}`}>Item {cartItemId}</li>
    );
    MockCartItem.propTypes = {
        cartItemId: PropTypes.any.isRequired,
    };
    return MockCartItem;
});

const mockNavigate = jest.fn();

beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
});

describe('Cart component', () => {

    
    test('renders empty cart message when cart is empty', () => {
        useCart.mockReturnValue({
            cartItems: [],
            getCartTotal: () => 0,
        });

        render(<Cart />);
        expect(screen.getByText(/the cart is empty/i)).toBeInTheDocument();
        expect(screen.queryByText(/checkout/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId('cart-items')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cart-items-total')).not.toBeInTheDocument();
    });
    


    test('renders cart items when cart has products', () => {
        useCart.mockReturnValue({
            cartItems: [
                { ID: 1, name: 'Product 1', picture: 'prod1.png', description: 'Desc 1', price: 100, quantity: 1 },
            ],
            getCartTotal: () => 100,
        });

        render(<Cart />);

        expect(screen.getByTestId('cart-items')).toBeInTheDocument();
        expect(screen.getByText(/total/i)).toBeInTheDocument();
        expect(screen.getByTestId('cart-items-total')).toHaveTextContent('100');
        expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    });

    test('clicking checkout button navigates to /payment', () => {
        useCart.mockReturnValue({
            cartItems: [
                { ID: 1, name: 'Product 1', picture: 'prod1.png', description: 'Desc 1', price: 100, quantity: 1 },
            ],
            getCartTotal: () => 100,
        });
        render(<Cart />);
        const checkoutButton = screen.getByText(/checkout/i);
        checkoutButton.click();

        expect(screen.queryByText(/checkout/i)).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith('/payment');
    }
    );
});
