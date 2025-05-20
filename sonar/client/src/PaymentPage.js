import React, { useState } from 'react';
import axios from 'axios';
import classes from "./Classes.module.css";
import { useCart } from './contexts/CartContext';


const PaymentPage = () => {
    const [formData, setFormData] = useState({
        cart_key: '',
        total: '',
    });
    const { getCartTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        const payload = {
            total: getCartTotal(),
            credit_card_no: formData.credit_card_no,
            expiry_date: formData.expiry_date,
            cvv: formData.cvv,
        };

        try {
            await axios.post('http://localhost:8080/payments', payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setStatus('Payment request submitted!');
        } catch (error) {
            console.error('Payment submission error:', error);
            setStatus('Error submitting payment.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={classes.paymentPageContainer}>
            <h2 className={classes.paymentFormTitle}>Make a Payment</h2>

            <form onSubmit={handleSubmit} className={classes.paymentForm}>
                <div className={classes.cartItemsTotalPrice}>
                    <p className={classes.totalLabel}>Total</p>
                    <p data-testid="cart-items-total" className={classes.cartItemsTotal}>{getCartTotal()}</p>
                    <span data-testid="cart-items-total-dollar-sign" className={classes.totalCurrency}>$</span>
                </div>
                <input
                    type="text"
                    name="credit_card"
                    placeholder="Credit Card Number"
                    onChange={(e) => setFormData({ ...formData, credit_card_no: e.target.value })}
                    className={classes.paymentInput}
                    required
                />
                <input
                    type="text"
                    name="expiry_date"
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    placeholder="Expiry Date (MM/YY)"
                    className={classes.paymentInput}
                    required
                />
                <input
                    type="text"
                    name="cvv"
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    placeholder="CVV"
                    className={classes.paymentInput}
                    required
                />
                <button type="submit" className={classes.paymentSubmitButton} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Payment'}
                </button>
                {status && (
                    <p data-testid="payment-status-message" className={classes.paymentStatusMessage}>{status}</p>
                )}
            </form>
        </div>
    );
};

export default PaymentPage;
