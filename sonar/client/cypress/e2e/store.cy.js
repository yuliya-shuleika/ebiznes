describe('Online Store - End-to-End Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    describe('Catalog page', () => {
        it('visits /products and shows catalog', () => {
            cy.visit('http://localhost:3000/products');
            cy.contains('Catalog');
        });

        it('visits / and shows catalog', () => {
            cy.visit('http://localhost:3000');
            cy.contains('Catalog');
        });

        it('renders correct page title', () => {
            cy.contains('Catalog');
        });

        it('displays products in catalog', () => {
            cy.get('[data-testid="catalog-item"]').should('have.length.greaterThan', 0);
        });

        it('navigates to cart from catalog', () => {
            cy.get('[data-testid="cart-link"]').click();
            cy.contains('Cart');
        });

        it('adds product to cart', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li').should('exist');
        });

        it('product has image', () => {
            cy.get('[data-testid="catalog-item"]').first().within(() => {
                cy.get('img').should('have.attr', 'src');
            });
        });

        it('product has title', () => {
            cy.get('[data-testid="catalog-item"]').first().within(() => {
                cy.get('h3').should('exist');
            });
        });

        it('product has description', () => {
            cy.get('[data-testid="catalog-item"]').first().within(() => {
                cy.get('[data-testid="catalog-item-description"]').should('exist');
            });
        });

        it('product has price', () => {
            cy.get('[data-testid="catalog-item"]').first().within(() => {
                cy.get('[data-testid="catalog-item-price"]').should('not.be.empty');
                cy.get('[data-testid="catalog-item-price"]').should('contain', '$');
            });
        });

        it('products have add to cart buttons', () => {
            cy.get('[data-testid="add-to-cart-button"]').should('have.length.greaterThan', 0);
        });

        it('adds multiple items to cart', () => {
            cy.get('[data-testid="add-to-cart-button"]').eq(0).click();
            cy.get('[data-testid="add-to-cart-button"]').eq(1).click();
            cy.get('[data-testid="add-to-cart-button"]').eq(2).click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li').should('have.length.at.least', 3);
        });

        it('adds same product to cart twice when clicked add button 2 times', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li').should('have.length', 1);
            cy.get('[data-testid="cart-item-count"]').should('have.text', '2');
        });
    });

    describe('Cart page', () => {
        it('visits /cart and shows cart', () => {
            cy.visit('http://localhost:3000/cart');
            cy.contains('Cart');
        });

        it('shows correct page title', () => {
            cy.get('[data-testid="cart-link"]').click();
            cy.get('h3').should('have.text', 'Cart');
        });

        it('shows empty cart message when no items', () => {
            cy.get('[data-testid="cart-link"]').click();
            cy.contains('The cart is empty.');
        });

        it('checkout hidden when cart is empty', () => {
            cy.visit('http://localhost:3000/cart');
            cy.contains('button', 'Checkout').should('not.exist');
        });

        it('does not show total price when cart is empty', () => {
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items-total"]').should('not.exist');
        });

        it('shows checkout button when items in cart', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.contains('button', 'Checkout').should('exist');
        });

        it('does not show empty cart message when items in cart', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.contains('The cart is empty.').should('not.exist');
        });

        it('checkout button goes to payment page', () => {
            cy.addItemAndGoToPayment();
            cy.contains('Make a Payment');
        });

        it('cart total increases after adding item', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items-total"]').should('not.have.text', '0');
        });

        it('cart displays product name', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li h4').should('exist').and('not.be.empty');
        });

        it('cart displays product description', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li [data-testid="cart-item-description"]').should('exist').and('not.be.empty');
        });

        it('cart displays product image', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li img').should('have.attr', 'src').and('not.be.empty');
        });

        it('cart displays product quantity', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li [data-testid="cart-item-count"]').should('exist').and('have.text', '1');
        });

        it('cart displays product price', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items"] li [data-testid="cart-item-price"]').should('exist').and('not.be.empty');
        });

        it('increments product quantity in cart', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-item-increment"]').click();
            cy.get('[data-testid="cart-item-count"]').should('have.text', '2');
        }
        );
        it('decrements product quantity in cart', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-item-decrement"]').click();
            cy.get('[data-testid="cart-item-count"]').should('have.text', '1');
        });

        it('deletes product from cart', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-item-delete"]').click();
            cy.get('[data-testid="cart-items"] li').should('not.exist');
        });

        it('when item quantity is one, decrement does nothing', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-item-decrement"]').click();
            cy.get('[data-testid="cart-items"] li').should('exist');
            cy.get('[data-testid="cart-item-count"]').should('have.text', '1');
        });

        function expectNumberIncreased(textBefore) {
            const valueBefore = parseFloat(textBefore.replace(/[^0-9.]/g, ''));
            cy.get('[data-testid="cart-item-increment"]').click();
            cy.get('[data-testid="cart-items-total"]').invoke('text').then((textAfter) => {
                const valueAfter = parseFloat(textAfter.replace(/[^0-9.]/g, ''));
                expect(valueAfter).to.be.greaterThan(valueBefore);
            });
        }

        it('increment changes total amount', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items-total"]').invoke('text').then((textBefore) => {
                expectNumberIncreased(textBefore);
            });
        });

        function expectNumberDecreased(textBefore, buttonToClick) {
            const valueBefore = parseFloat(textBefore.replace(/[^0-9.]/g, ''));
            buttonToClick.click();
            cy.get('[data-testid="cart-items-total"]').invoke('text').then((textAfter) => {
                const valueAfter = parseFloat(textAfter.replace(/[^0-9.]/g, ''));
                expect(valueAfter).to.be.lessThan(valueBefore);
            });
        }

        it('decrement changes total amount', () => {
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="add-to-cart-button"]').first().click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items-total"]').invoke('text').then((textBefore) => {
                expectNumberDecreased(textBefore, cy.get('[data-testid="cart-item-decrement"]'));
            });
        });

        it('remove item from cart changes total amount', () => {
            cy.get('[data-testid="add-to-cart-button"]').eq(0).click();
            cy.get('[data-testid="add-to-cart-button"]').eq(1).click();
            cy.get('[data-testid="cart-link"]').click();
            cy.get('[data-testid="cart-items-total"]').invoke('text').then((textBefore) => {
                expectNumberDecreased(textBefore, cy.get('[data-testid="cart-item-delete"]').eq(0));
            });
        });
    });

    describe('Payment page', () => {
        it('visits /payment and shows payment page', () => {
            cy.visit('http://localhost:3000/payment');
            cy.contains('Make a Payment');
        });

        it('displays payment form', () => {
            cy.addItemAndGoToPayment();
            cy.get('form').should('exist');
        });

        it('shows credit card input', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').should('exist');
        });

        it('shows expiry date input', () => {
            cy.addItemAndGoToPayment();

            cy.get('input[name="expiry_date"]').should('exist');
        });

        it('shows CVV input', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="cvv"]').should('exist');
        });

        it('shows submit button with the correct text', () => {
            cy.addItemAndGoToPayment();
            cy.get('button[type="submit"]').should('exist');
            cy.get('button[type="submit"]').should('have.text', 'Submit Payment');
        });

        it('submits valid payment form', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').type('4111111111111111');
            cy.get('input[name="expiry_date"]').type('12/25');
            cy.get('input[name="cvv"]').type('123');
            cy.get('form').submit();
            cy.contains('submitted');
        });

        it('shows validation on empty payment form', () => {
            cy.addItemAndGoToPayment();
            cy.get('form').submit();
            cy.get('input:invalid').should('have.length.at.least', 1);
        });

        it('payment form shows status after submitting', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').type('4111111111111111');
            cy.get('input[name="expiry_date"]').type('12/25');
            cy.get('input[name="cvv"]').type('123');
            cy.get('form').submit();
            cy.get('[data-testid="payment-status-message"').should('exist');
            cy.get('[data-testid="payment-status-message"]').should('not.be.empty');
        });

        it('total is shown on payment form', () => {
            cy.addItemAndGoToPayment();
            cy.get('[data-testid="cart-items-total"]').invoke('text').then((text) => {
                const value = parseFloat(text.replace(/[^0-9.]/g, ''));
                expect(value).to.be.greaterThan(0);
            });
        });

        it('shows dollar sign next to total', () => {
            cy.addItemAndGoToPayment();
            cy.get('[data-testid="cart-items-total-dollar-sign"]').should('have.text', '$');
        });

        it('does not show a message when payment is not yet submitted', () => {
            cy.addItemAndGoToPayment();
            cy.get('[data-testid="payment-status-message"]').should('not.exist');
        });

        function waitForDelayedReply(req) {
            req.reply((res) => {
                res.send({ delay: 2000 });
            });
        }

        it('payment button is disabled during loading', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').type('4111111111111111');
            cy.get('input[name="expiry_date"]').type('12/25');
            cy.get('input[name="cvv"]').type('123');
            cy.intercept('POST', '/payments', (req) => {
                waitForDelayedReply(req);
                waitForDelayedReply(req);
            });
            cy.get('button[type="submit"]').click();
            cy.get('button[type="submit"]').should('be.disabled');
        });

        it('payment button changes text on loading', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').type('4111111111111111');
            cy.get('input[name="expiry_date"]').type('12/25');
            cy.get('input[name="cvv"]').type('123');
            cy.intercept('POST', '/payments', (req) => {
                waitForDelayedReply(req);
                waitForDelayedReply(req);
            });
            cy.get('button[type="submit"]').click();
            cy.get('button[type="submit"]').should('have.text', 'Submitting...');
        });

        it('shows error message on payment failure', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').type('4111111111111111');
            cy.get('input[name="expiry_date"]').type('12/25');
            cy.get('input[name="cvv"]').type('123');
            cy.intercept('POST', '/payments', {
                statusCode: 500,
                body: { error: 'Payment failed' },
            });
            cy.get('form').submit();
            cy.get('[data-testid="payment-status-message"]').should('contain.text', 'Error submitting payment.');
        });

        it('shows success message on payment success', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').type('4111111111111111');
            cy.get('input[name="expiry_date"]').type('12/25');
            cy.get('input[name="cvv"]').type('123');
            cy.intercept('POST', '/payments', {
                statusCode: 200,
                body: { message: 'Payment successful' },
            });
            cy.get('form').submit();
            cy.get('[data-testid="payment-status-message"]').should('contain.text', 'Payment request submitted!');
        });
    });
});

Cypress.Commands.add('addItemAndGoToPayment', () => {
    cy.get('[data-testid="add-to-cart-button"]').first().click();
    cy.get('[data-testid="cart-link"]').click();
    cy.contains('button', 'Checkout').click();
});
