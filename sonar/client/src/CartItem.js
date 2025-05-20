import classes from "./Classes.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./contexts/CartContext";
import PropTypes from "prop-types";

const CartItem = ({ cartItemId }) => {

    const { addToCart, removeFromCart, removeOneFromCart, cartItems } = useCart();
    console.log(cartItems);
    console.log(cartItemId);
    const cartItem = cartItems.find(item => item.ID === cartItemId);
    const clickPlus = () => {
        addToCart(cartItem);
    };

    const clickMinus = () => {
        removeOneFromCart(cartItem.ID);
    }

    const deleteItem = () => {
        removeFromCart(cartItem.ID);
    }

    return (
        <li className={classes.cartItem}>
            <div className={classes.cartItemInformation}>
                <img
                    src={`/images/${cartItem.picture}`}
                    alt={cartItem.name}
                    className={classes.cartItemImage}
                />
                <div className={classes.cartItemTitle}>
                    <h4 className={classes.cartItemName}>{cartItem.name}</h4>
                    <p className={classes.cartItemDescription} data-testid="cart-item-description">
                        {cartItem.description}
                    </p>
                </div>
            </div>
            <div className={classes.cartItemManage}>
                <div className={classes.cartItemPrice}>
                    <p data-testId="cart-item-price" className={classes.cartItemPriceValue}>
                        {cartItem.price}
                    </p>
                    <span className={classes.cartItemPriceCurrency}>$</span>
                    <div>
                        <div className={classes.cartItemCount}>
                            <button
                                type="button"
                                className={classes.cartItemCountUpdate}
                                data-testid="cart-item-increment"
                                onClick={clickPlus}
                                aria-label="Increase quantity"
                            >
                                <span className={classes.plusMinusButton}>+</span>
                            </button>
                            <p className={classes.cartItemCountLabel} data-testid="cart-item-count">{cartItem.quantity}</p>
                            <button
                                type="button"
                                className={classes.cartItemCountUpdate}
                                onClick={clickMinus}
                                data-testid="cart-item-decrement"
                                aria-label="Decrease quantity"
                            >
                                <span className={classes.plusMinusButton}>-</span>
                            </button>
                            <div className={classes.cartItemDelete}>
                                <button
                                    type="button"
                                    className={classes.cartItemDeleteButton}
                                    onClick={deleteItem}
                                    data-testid="cart-item-delete"
                                    aria-label="Remove item"
                                >
                                    <FontAwesomeIcon icon={faTrash} className={classes.trashIcon} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
CartItem.propTypes = {
    cartItemId: PropTypes.number.isRequired,
};

export default CartItem;
