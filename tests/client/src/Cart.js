import CartItem from "./CartItem";
import classes from "./Classes.module.css";
import { useCart } from "./contexts/CartContext";
import { useNavigate } from 'react-router-dom';


const  Cart = () => {
    const { cartItems, getCartTotal } = useCart();
    const navigate =  useNavigate();
    const handleCheckoutClick = () => {
        navigate('/payment');
    };

    let cartItemsToRender = [];
    for (let cartItem of cartItems) {
        cartItemsToRender.push(<CartItem cartItemId={cartItem.ID}/>);
    }

    const emptyCart = (
        <div className={classes.cartEmpty}>
            <p className={classes.cartEmptyLabel}>The cart is empty.</p>
        </div>
    );

    const cartWithItems = (
        <div className={classes.cartItemsContainer}>
            <div className={classes.cartItems}>
                <ul className={classes.cartItemsList}>{cartItemsToRender}</ul>
            </div>
            <hr className={classes.cartItemsDelimiter} />
            <div>
                <div className={classes.cartFooter}>
                    <div className={classes.cartItemsTotalPrice}>
                        <p className={classes.totalLabel}>Total</p>
                        <p className={classes.cartItemsTotal}>{getCartTotal()}</p>
                        <span className={classes.totalCurrency}>$</span>
                    </div>
                    <div className={classes.cartItemsManage}>
                        <button className={classes.checkout} type="button" onClick={handleCheckoutClick}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={classes.cartBody}>
            <div className={classes.cartContent}>
                <div className={classes.cartHeader}>
                    <h3 className={classes.cartTitle}>Cart</h3>
                </div>
                {cartItemsToRender.length > 0 ? cartWithItems : emptyCart}
            </div>
        </div>
    );
}

export default Cart;