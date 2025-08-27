import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BraintreeDropIn from "./BraintreeDropIn";

export default function UserCartSideBar() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  // state
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  // hooks
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.token) {
      getClientToken();
    }
  }, [auth?.token]);

  const getClientToken = async () => {
    try {
      const { data } = await axios.get("/braintree/token");
      setClientToken(data.clientToken);
    } catch (err) {
      console.log(err);
    }
  };

  const cartTotal = () => {
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const handleBuy = async () => {
    try{
      setLoading(true);
      const {nonce} = await instance.requestPaymentMethod();
      // console.log(nonce);

      const {data} = await axios.post("/braintree/payment", {
        nonce,
        cart,
      });
      
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment successful. Thank you for your purchase!");
    }catch(err){
      console.log(err);
      toast.error("Payment failed. Try again.");
    }
  }

  return (
    <div className="col-md-4 mb-5">
      <h4>Your Cart Summary</h4>
      Total/Adress/Payments
      <hr />
      <h6>Total: {cartTotal()} </h6>

      {auth?.user?.address ? (
        <>
          <div className="mb-3">
            <hr />
            <h4>Delivery Address:</h4>
            <h5>{auth?.user?.address}</h5>
          </div>
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate("/dashboard/user/profile")}
          >
            Update Address
          </button>
        </>
      ) : (
        <div className="mb-3">
          {auth?.token ? (
            <button
              className="btn btn-outline-warning"
              onClick={() => navigate("/dashboard/user/profile")}
            >
              Add Delivery Address
            </button>
          ) : (
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate("/login", { state: "/cart" })}
            >
              Login to Checkout
            </button>
          )}
        </div>
      )}
      <div className="mt-5">
        {clientToken && (
          <>
          <BraintreeDropIn
            authorization={clientToken}
            amount="25.00"
            currency="USD"
            options={{
              paypal: {
                flow: "checkout",
                amount: 25.00,
                currency: "USD",
              },
            }}
            onInstance={(instance) => setInstance(instance)}
            onError={(err) => {
              console.error("Dropin error:", err);
            }}
          />
          <button onClick={handleBuy} className="btn btn-primary col-12 mt-2" disabled={!auth?.user?.address || !instance || loading}>
            {loading ? "Processing..." : "Buy"}
          </button>
          </>
        )}
      </div>
    </div>
  );
}
