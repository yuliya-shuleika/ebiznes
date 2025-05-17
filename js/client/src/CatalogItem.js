import classes from "./Classes.module.css";
import { useCart } from './contexts/CartContext';

const CatalogItem = ({ item }) => {
  const { addToCart } = useCart();
  
  return (
    <div className={classes.catalogItem}>
      <img
        src={'/images/' + item.picture}
        className={classes.catalogItemPicture}
        alt={item.name}
      />
      <div className={classes.catalogItemContent}>
        <h3 className={classes.catalogItemTitle}>{item.name}</h3>
        <p className={classes.catalogItemDescription}>{item.description}</p>
      </div>
      <div className={classes.catalogItemBottom}>
        <div className={classes.catalogItemPrice}>
          <p className={classes.catalogPriceValue}>{item.price}</p>
          <span className={classes.catalogItemPriceCurrency}>$</span>
        </div>
        <div>
          <button
            className={classes.catalogItemButton}
            onClick={() => addToCart(item)}
            type="button"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CatalogItem;