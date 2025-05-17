describe('Online Store - End-to-End Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    describe('Catalog page', () => {
        it('visits /products and shows catalog', () => {
            cy.visit('http://localhost:3000/products');
            cy.contains('Catalog');
        });

        it('redirects to catalog page', () => {
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
    });

    describe('Cart page', () => {
        it('visits /cart and shows cart', () => {
            cy.visit('http://localhost:3000/cart');
            cy.contains('Cart');
        });

        it('shows empty cart message when no items', () => {
            cy.get('[data-testid="cart-link"]').click();
            cy.contains('The cart is empty.');
        });

        it('checkout hidden when cart is empty', () => {
            cy.visit('http://localhost:3000/cart');
            cy.contains('button', 'Checkout').should('not.exist');
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
    });

    describe('Payment page', () => {
        it('visits /payment and shows payment page', () => {
            cy.visit('http://localhost:3000/payment');
            cy.contains('Make a Payment');
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

        it('payment form shows status after successful submit', () => {
            cy.addItemAndGoToPayment();
            cy.get('input[name="credit_card"]').type('4111111111111111');
            cy.get('input[name="expiry_date"]').type('12/25');
            cy.get('input[name="cvv"]').type('123');
            cy.get('form').submit();
            cy.get('[data-testid="payment-status-message"').should('contain.text', 'Payment request submitted!');
        });

        it('total is shown on payment form', () => {
            cy.addItemAndGoToPayment();
            cy.get('[data-testid="cart-items-total"]').invoke('text').then((text) => {
                const value = parseFloat(text.replace(/[^0-9.]/g, ''));
                expect(value).to.be.greaterThan(0);
            });
        });
    });
    /*




    

    it('cart total includes $ currency', () => {
        cy.get('.catalogItemButton').first().click();
        cy.get('.cartLink').click();
        cy.get('.totalCurrency').should('contain', '$');
    });

   
    */
});

Cypress.Commands.add('addItemAndGoToPayment', () => {
    cy.get('[data-testid="add-to-cart-button"]').first().click();
    cy.get('[data-testid="cart-link"]').click();
    cy.contains('button', 'Checkout').click();
});
