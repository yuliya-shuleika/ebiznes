import React from 'react';
import { render, screen } from '@testing-library/react';
import CatalogItems from './CatalogItems';
import { useCatalog } from './contexts/CatalogContext';
import PropTypes from 'prop-types';

jest.mock('./Classes.module.css', () => ({
    catalogItems: 'catalogItems',
    emptyCatalogList: 'emptyCatalogList',
    emptyCatalogListLabel: 'emptyCatalogListLabel',
}));

const MockCatalogItem = ({ itemId }) => (
    <div data-testid="catalog-item">CatalogItem {itemId}</div>
);
MockCatalogItem.propTypes = {
    itemId: PropTypes.any,
};
jest.mock('./CatalogItem', () => MockCatalogItem);

jest.mock('./contexts/CatalogContext', () => ({
    useCatalog: jest.fn(),
}));


//8 assertions

describe('CatalogItems', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders catalog items when items are present', () => {
        useCatalog.mockReturnValue({
            items: [
                { ID: 1, name: 'Item 1' },
                { ID: 2, name: 'Item 2' },
            ],
        });

        render(<CatalogItems />);
        const catalogItems = screen.getAllByTestId('catalog-item');
        expect(catalogItems).toHaveLength(2);
        expect(catalogItems[0]).toHaveTextContent('CatalogItem 1');
        expect(catalogItems[1]).toHaveTextContent('CatalogItem 2');
        expect(screen.queryByText('No items were found')).not.toBeInTheDocument();
    });

    it('renders empty message when no items are present', () => {
        useCatalog.mockReturnValue({ items: [] });

        render(<CatalogItems />);
        expect(screen.getByText('No items were found')).toBeInTheDocument();
        expect(screen.queryByTestId('catalog-item')).not.toBeInTheDocument();
    });

    it('renders empty message when items is undefined', () => {
        useCatalog.mockReturnValue({ items: undefined });

        render(<CatalogItems />);
        expect(screen.getByText('No items were found')).toBeInTheDocument();
        expect(screen.queryByTestId('catalog-item')).not.toBeInTheDocument();
    });

    it('renders empty message when items is null', () => {
        useCatalog.mockReturnValue({ items: null });

        render(<CatalogItems />);
        expect(screen.getByText('No items were found')).toBeInTheDocument();
        expect(screen.queryByTestId('catalog-item')).not.toBeInTheDocument();
    });
});