import React from 'react'

function CartSummary({ subtotal, shipping, tax, total, itemCount }) {
  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      
      <div className="summary-line">
        <span>Subtotal ({itemCount} items)</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      
      <div className="summary-line">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
      </div>
      
      {shipping === 0 && (
        <div className="free-shipping-note">
          🎉 You qualify for free shipping!
        </div>
      )}
      
      <div className="summary-line">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <button className="checkout-btn">
        Proceed to Checkout
      </button>
      
      <button className="continue-shopping-btn">
        Continue Shopping
      </button>
      
      <div className="security-badges">
        <div className="security-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Secure Checkout</span>
        </div>
        <div className="security-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
          </svg>
          <span>30-Day Returns</span>
        </div>
      </div>
    </div>
  )
}

export default CartSummary