import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CatalogItem from './CatalogItem';

//8 assertions

const mockAddToCart = jest.fn();
const mockItems = [
    {
        ID: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        picture: 'test.jpg'
    }
];

jest.mock('./contexts/CartContext', () => ({
    useCart: () => ({
        addToCart: mockAddToCart
    })
}));

jest.mock('./contexts/CatalogContext', () => ({
    useCatalog: () => ({
        items: mockItems
    })
}));

describe('CatalogItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders item details', () => {
        render(<CatalogItem itemId={1} />);
        expect(screen.getByTestId('catalog-item')).toBeInTheDocument();
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByTestId('catalog-item-description')).toHaveTextContent('A test product');
        expect(screen.getByTestId('catalog-item-price')).toHaveTextContent('99.99');
        expect(screen.getByAltText('Test Product')).toHaveAttribute('src', '/images/test.jpg');
    });

    it('calls addToCart when button is clicked', () => {
        render(<CatalogItem itemId={1} />);
        fireEvent.click(screen.getByTestId('add-to-cart-button'));
        expect(mockAddToCart).toHaveBeenCalledWith(mockItems[0]);
    });

    it('renders nothing if item is not found', () => {
        render(<CatalogItem itemId={999} />);
        expect(screen.queryByTestId('catalog-item')).toBeNull();
    });

    it('renders price with currency', () => {
        render(<CatalogItem itemId={1} />);
        expect(screen.getByText('$')).toBeInTheDocument();
    });
});

// We recommend installing an extension to run jest tests.