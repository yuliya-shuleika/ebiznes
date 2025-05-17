import CatalogItems from "./CatalogItems";
import classes from "./Classes.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
    const navigate = useNavigate();
    const handleCartClick = () => {
        navigate('/cart');
    };

    return (
        <div className={classes.catalogContainer}>
            <div className={classes.catalogHeader}>
                <h2 className={classes.catalogTitle}>Catalog</h2>
                <div className={classes.cartLink} onClick={handleCartClick}>
                    <FontAwesomeIcon icon={faShoppingCart} className={classes.icon} />
                </div>
            </div>
            <div className={classes.catalogPanel}>
                <CatalogItems />
            </div>
        </div>
    );
}

export default Catalog;
