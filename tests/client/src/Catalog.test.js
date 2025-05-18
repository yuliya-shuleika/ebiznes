import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router';
import Catalog from './Catalog';
import { useCatalog } from './contexts/CatalogContext';

jest.mock('./contexts/CatalogContext');

//3 assertions
const mockCatalogItems = [
    { ID: 1, name: 'Product 1', picture: 'prod1.png', description: 'Desc 1', price: 100 },
    { ID: 2, name: 'Product 2', picture: 'prod2.png', description: 'Desc 2', price: 200 },
];

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

jest.mock('./CatalogItems', () => () => (
    <div data-testid="catalog-items">Mock Catalog Items</div>
));

const mockNavigate = jest.fn();


beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
});

describe('Catalog component', () => {
    test('renders catalog title and cart icon', () => {
        useCatalog.mockReturnValue({
            items: mockCatalogItems,
        });
        render(<Catalog />);

        expect(screen.getByText(/catalog/i)).toBeInTheDocument();
        expect(screen.getByTestId('cart-link')).toBeInTheDocument();
    });

    test('navigates to /cart on cart icon click', () => {
        render(<Catalog />);
        const cartIcon = screen.getByTestId('cart-link');
        fireEvent.click(cartIcon);
        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });
});
