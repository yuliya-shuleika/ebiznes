import classes from "./Classes.module.css";
import CatalogItem from "./CatalogItem";
import { useCatalog } from './contexts/CatalogContext';

const CatalogItems = () => {
  const { items } = useCatalog();
  console.log(items);

  return (
    <div className={classes.catalogItems}>
      {items && items.length > 0 ? (
        items.map(item => <CatalogItem itemId={item.ID} />)
      ) : (
        <div className={classes.emptyCatalogList}>
          <p className={classes.emptyCatalogListLabel}>No items were found</p>
        </div>
      )}
    </div>
  );
}

export default CatalogItems;