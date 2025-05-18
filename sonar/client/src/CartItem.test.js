import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from './CartItem';
import { useCart } from './contexts/CartContext';

jest.mock('./contexts/CartContext');

//8 assertions
const mockItem = {
    ID: 1,
    name: 'Product 1',
    picture: 'prod1.png',
    description: 'Description of Product 1',
    price: 100,
    quantity: 2,
};

const mockAddToCart = jest.fn();
const mockRemoveOneFromCart = jest.fn();
const mockRemoveFromCart = jest.fn();

beforeEach(() => {
    useCart.mockReturnValue({
        addToCart: mockAddToCart,
        removeFromCart: mockRemoveFromCart,
        removeOneFromCart: mockRemoveOneFromCart,
        cartItems: [mockItem],
    });

    jest.clearAllMocks();
});

describe('CartItem component', () => {
    test('renders item details correctly', () => {
        render(<CartItem cartItemId={1} />);

        expect(screen.getByText(mockItem.name)).toBeInTheDocument();
        expect(screen.getByTestId('cart-item-description')).toHaveTextContent(mockItem.description);
        expect(screen.getByTestId('cart-item-count')).toHaveTextContent(mockItem.quantity.toString());
        expect(screen.getByTestId('cart-item-price')).toHaveTextContent(mockItem.price.toString());
        expect(screen.getByAltText(mockItem.name)).toHaveAttribute('src', `/images/${mockItem.picture}`);
    });

    test('calls addToCart when + button is clicked', () => {
        render(<CartItem cartItemId={1} />);

        fireEvent.click(screen.getByTestId('cart-item-increment'));
        expect(mockAddToCart).toHaveBeenCalledWith(mockItem);
    });

    test('calls removeOneFromCart when - button is clicked', () => {
        render(<CartItem cartItemId={1} />);

        fireEvent.click(screen.getByTestId('cart-item-decrement'));
        expect(mockRemoveOneFromCart).toHaveBeenCalledWith(mockItem.ID);
    });

    test('calls removeFromCart when delete button is clicked', () => {
        render(<CartItem cartItemId={1} />);

        fireEvent.click(screen.getByTestId('cart-item-delete'));
        expect(mockRemoveFromCart).toHaveBeenCalledWith(mockItem.ID);
    });
});
