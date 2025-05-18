import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentPage from './PaymentPage';
import { useCart } from './contexts/CartContext';
import axios from 'axios';

jest.mock('./contexts/CartContext', () => ({
    useCart: jest.fn(),
}));

//17 assertions

jest.mock('axios');

describe('PaymentPage', () => {
    beforeEach(() => {
        useCart.mockReturnValue({
            getCartTotal: () => 123.45,
        });
        jest.clearAllMocks();
    });

    it('renders payment form fields and total', () => {
        render(<PaymentPage />);
        expect(screen.getByText('Make a Payment')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Credit Card Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Expiry Date (MM/YY)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('CVV')).toBeInTheDocument();
        expect(screen.getByText('123.45')).toBeInTheDocument();
        expect(screen.getByText('$')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit payment/i })).toBeInTheDocument();
    });

    it('submits payment and shows success message', async () => {
        axios.post.mockResolvedValueOnce({});
        render(<PaymentPage />);
        fireEvent.change(screen.getByPlaceholderText('Credit Card Number'), { target: { value: '4111111111111111' } });
        fireEvent.change(screen.getByPlaceholderText('Expiry Date (MM/YY)'), { target: { value: '12/25' } });
        fireEvent.change(screen.getByPlaceholderText('CVV'), { target: { value: '123' } });

        fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

        expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText('Payment request submitted!')).toBeInTheDocument();
        });

        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/payments',
            {
                total: 123.45,
                credit_card_no: '4111111111111111',
                expiry_date: '12/25',
                cvv: '123',
            },
            expect.any(Object)
        );
    });

    it('shows error message on failed payment', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network error'));
        render(<PaymentPage />);
        fireEvent.change(screen.getByPlaceholderText('Credit Card Number'), { target: { value: '4111111111111111' } });
        fireEvent.change(screen.getByPlaceholderText('Expiry Date (MM/YY)'), { target: { value: '12/25' } });
        fireEvent.change(screen.getByPlaceholderText('CVV'), { target: { value: '123' } });

        fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

        await waitFor(() => {
            expect(screen.getByText('Error submitting payment.')).toBeInTheDocument();
        });
    });

    it('disables submit button while loading', async () => {
        let resolvePromise;
        axios.post.mockImplementation(
            () => new Promise((resolve) => { resolvePromise = resolve; })
        );
        render(<PaymentPage />);
        fireEvent.change(screen.getByPlaceholderText('Credit Card Number'), { target: { value: '4111111111111111' } });
        fireEvent.change(screen.getByPlaceholderText('Expiry Date (MM/YY)'), { target: { value: '12/25' } });
        fireEvent.change(screen.getByPlaceholderText('CVV'), { target: { value: '123' } });

        fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

        expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
        expect(screen.getByText('Submitting...')).toBeInTheDocument();
        expect(screen.queryByText('Submit Payment')).not.toBeInTheDocument();

        // Finish the promise
        resolvePromise({});
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /submit payment/i })).not.toBeDisabled();
            expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
            expect(screen.getByText('Submit Payment')).toBeInTheDocument();
        });
    });
});