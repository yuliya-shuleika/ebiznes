import { useState, useEffect } from "react";
import classes from "./Classes.module.css";
import CatalogItem from "./CatalogItem";
import axios from "axios";

const CatalogItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  let itemsToRender = [];
  for (const item of items) {
    itemsToRender.push(<CatalogItem item={item}/>);
  }

  if (items.length > 0) {
    return <div className={classes.catalogItems}>{itemsToRender}</div>;
  }

  return (
    <div className={classes.catalogItems}>
      <div className={classes.emptyCatalogList}>
        <p className={classes.emptyCatalogListLabel}>No items were found</p>
      </div>
    </div>
  );
}

export default CatalogItems;