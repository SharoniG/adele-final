import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, updateQuantity } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";


const Cart = () => {

  
  const cartItems = useSelector((state: any) => state.cart); 
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order");
      return;
    }

    const order = {
      customer: user._id,
      items: cartItems.map(item => ({ product: item._id,quantity: item.quantity })), //בניית מערך עם הפריטים 
      totalPrice: total
    };

    try {
      const res = await fetch("http://localhost:3000/orders/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(order)
      });

      if (res.ok) {
         toast.success("Order placed");
        dispatch(clearCart());
        navigate("/account");
      } else {
        toast.success("Error placing order");
      }
    } catch (error) {
      console.error("Error:", error);
    }

  };

  if (cartItems.length === 0) {
    return <p className={styles.empty}>🛒 Your cart is empty</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <FontAwesomeIcon icon={faCartShopping} /> My Cart
      </h2>

      <div className={styles.cartGrid}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.productCode}>
                <td className={styles.itemCell}>
                  <img src={item.imageUrl} alt={item.name} className={styles.image} />
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                </td>
                <td>{item.price} $</td>
                <td>
                  <div className={styles.qtyControls}>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({
                          productCode: item.productCode,
                          quantity: item.quantity - 1
                        }))
                      }
                      disabled={item.quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({
                          productCode: item.productCode,
                          quantity: item.quantity + 1
                        }))
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </td>
                <td>{item.price * item.quantity} $</td>
                <td>
                  <button
                    className={styles.removeBtn}
                    onClick={() => {
                      dispatch(removeFromCart(item.productCode));
                      toast.success(`${item.name} was removed from cart`);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.summary}>
          <h3>Order Summary</h3>
 
          <p><strong>Shipping:</strong> Free</p>
          <p><strong>Total:</strong> {total} $</p>

          <div className={styles.actions}>
            <button onClick={handlePlaceOrder} className={styles.placeBtn}>Place Order</button>
            <button onClick={() => dispatch(clearCart())} className={styles.clearBtn}>Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;