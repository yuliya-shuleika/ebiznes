import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const CatalogContext = createContext();

export const useCatalog = () => useContext(CatalogContext);

export const CatalogProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/products', {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((res) => setItems(res.data))
        .catch((err) => console.error(err));
    }, []);

    const value = useMemo(() => ({ items }), [items]);

    return (
        <CatalogContext.Provider value={value}>
            {children}
        </CatalogContext.Provider>
    );
};

CatalogProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
