import React from 'react'

function CartItem({item}) {

  console.log(item);

  return (
    <div className="cart-item">
      <div className="item-image">
        <img src={item.image} alt={item.name} />
      </div>
      
      <div className="item-details">
        <div className="item-info">
          <h3 className="item-name">{item.name}</h3>
          <div className="item-availability">
            <span className="stock-status">
              {/* {item.maxStock > 5 ? 'In Stock' : `Only ${item.maxStock} left`} */}
              5 left
            </span>
          </div>
        </div>
        
        <div className="item-actions">
          <div className="quantity-controls">
            <button 
              className="quantity-btn"
              // onClick={() => handleQuantityChange(-1)}
              // disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="quantity">quantity</span>
            <button 
              className="quantity-btn"
              // onClick={() => handleQuantityChange(1)}
              // disabled={item.quantity >= item.maxStock}
            >
              +
            </button>
          </div>
          
          <button 
            className="remove-btn"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
      
      <div className="item-pricing">
        <div className="current-price">price</div>
        {item.originalPrice > item.price && (
          <div className="original-price">i don't know</div>
        )}
        <div className="item-total">{/*${(item.price * item.quantity).toFixed(2)}*/}4</div>
        {savings > 0 && (
          <div className="savings">savings</div>
        )}
      </div>
    </div>
  )
}

export default CartItem