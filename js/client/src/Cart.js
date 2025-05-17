import CartItem from "./CartItem";
import classes from "./Classes.module.css";
import { useCart } from "./contexts/CartContext";
import { useNavigate } from 'react-router-dom';


const  Cart = () => {
    const { cartItems, clearCart } = useCart();
    const navigate =  useNavigate();
    const handleCheckoutClick = () => {
        navigate('/payment');
    };

    let cartItemsToRender = [];
    for (let cartItem of cartItems) {
        cartItemsToRender.push(<CartItem cartItem={cartItem}/>);
    }

    const emptyCart = (
        <div className={classes.cartEmpty}>
            <p className={classes.cartEmptyLabel}>The cart is empty.</p>
        </div>
    );

    const cartItemsTotal = () => {
        let total = 0;
        for (let cartItem of cartItems) {
            total += cartItem.price * cartItem.quantity;
        }

        return total.toFixed(2);
    };

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
                        <p className={classes.cartItemsTotal}>{cartItemsTotal()}</p>
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