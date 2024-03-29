import "./cart-dropdown.styles.scss";
import Button from "../button/button.component";
import CartItemComponent from "../cart-item/cart-item.component";
// import { CartContext } from "../../contexts/cart.context";
// import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

export default function CartDropdownComponent() {
  const { cartItems } = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);

  const navigate = useNavigate();

  ////console.log("cart items:", cartItems);
  const handleCheckout = () => {
    console.log(currentUser);
    navigate("/checkout");

    if (!currentUser) {
      alert("Please login to continue");
      navigate("/auth");
    }
  };
  return (
    <div className="cart-dropdown-container">
      <div className="cart-items">
        {cartItems.map((cartItem) => (
          <CartItemComponent key={cartItem.id} cartItem={cartItem} />
        ))}
      </div>
      <Button onClick={handleCheckout} buttonType="dropDown">
        GO TO CHECKOUT
      </Button>
    </div>
  );
}
