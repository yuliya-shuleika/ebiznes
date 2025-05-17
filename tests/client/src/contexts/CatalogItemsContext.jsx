import React, { createContext, useContext, useState, useEffect } from 'react';
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

    return (
        <CatalogContext.Provider value={{ items }}>
            {children}
        </CatalogContext.Provider>
    );
};
