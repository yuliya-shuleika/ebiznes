import classes from "./Classes.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./contexts/CartContext";

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
                    <p className={classes.cartItemDescription}>
                        {cartItem.description}
                    </p>
                </div>
            </div>
            <div className={classes.cartItemManage}>
                <div className={classes.cartItemPrice}>
                    <p className={classes.cartItemPriceValue}>
                        {cartItem.price}
                    </p>
                    <span className={classes.cartItemPriceCurrency}>$</span>
                    <div>
                        <div className={classes.cartItemCount}>
                            <div className={classes.cartItemCountUpdate} onClick={clickPlus}>
                                <span className={classes.plusMinusButton}>+</span>
                            </div>
                            <p className={classes.cartItemCountLabel}>{cartItem.quantity}</p>
                            <div className={classes.cartItemCountUpdate} onClick={clickMinus}>
                                <span className={classes.plusMinusButton}>-</span>
                            </div>
                            <div className={classes.cartItemDelete}>
                                <div className={classes.cartItemDeleteButton} onClick={deleteItem}>
                                    <FontAwesomeIcon icon={faTrash} className={classes.trashIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default CartItem;