import Jumbotron from '../components/cards/Jumbotron.jsx'
import {useCart} from '../context/cart.jsx';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/auth.jsx';
import moment from 'moment';

export default function Cart() {
  //context
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  //hooks
  const navigate = useNavigate();

  const removeFromCart = (productId) => {
    let myCart = [...cart];
    let index = myCart.findIndex((item) => item._id === productId );
    myCart.splice(index,1);
    setCart(myCart);
    localStorage.setItem("cart", JSON.stringify(myCart));
  }

  const cartTotal = () => {
    let total=0;
    cart.map((item) => {
      total+=item.price;
    });
    return total.toLocaleString("INR",{
        style: 'currency',
        currency: 'INR'
    });
  }

  return (
    <>
      <Jumbotron 
      title={`Hello ${auth?.token && auth?.user?.name}`} 
      subTitle={cart?.length ? `You have ${cart?.length} products in the cart. ${auth?.token ? "" : 'Please login to checkout'}`
      : 'Your cart is empty'
      } 
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="p-3 mt-2 mb-2 h4 bg-light text-center">
              {cart?.length ? (
                'My Cart'
              ) : (
                <div className="text-center">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {cart?.length && (
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {cart?.map((p,index) => (
                  <div 
                    key={index} 
                    className="card mb-3" 
                    // style={{ maxWidth: 540}}
                  >
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img 
                          src={`${
                            import.meta.env.VITE_API
                          }/product/photo/${p._id}`} 
                          alt={p.name}
                          style={{
                            height: '150px',
                            width: '150px', 
                            objectFit: 'cover', 
                            marginLeft: '-12px', 
                            borderTopRightRadius: "0px"
                          }}
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="card-body">
                          <h5 className="card-title">
                            {p.name}{" "}
                            {p?.price?.toLocaleString("INR",{
                                style: 'currency',
                                currency: 'INR'
                            })}
                          </h5>
                          <p className="card-text">
                            {`${p?.description?.substring(
                              0,
                              50
                            )}...`}
                          </p> 
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="card-text">
                          <small className="text-muted">
                            Listed {moment(p.createdAt).fromNow()}
                          </small>
                        </p>
                        <p 
                        className="text-danger mb-2 pointer"
                        onClick={() => removeFromCart(p._id)}
                        >
                          Remove
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <h4>Your Cart Summary</h4>
              Total/Adress/Payments
              <hr/>
              <h6>Total: {cartTotal()} </h6>

              {auth?.user?.address ? (
                <>
                <div className="mb-3">
                  <hr/>
                  <h4>Address:</h4>
                  <h5>{auth?.user?.address}</h5>
                </div>
                <button className="btn btn-outline-warning" onClick={()=> navigate("/dashboard/user/profile")}>Update Address</button></>
              ):(
                <div className="mb-3">
                  {auth?.token ? (
                    <button className="btn btn-outline-warning" onClick={()=> navigate("/dashboard/user/profile")}>
                      Add Delivery Address
                    </button>
                  ) : (
                    <button className="btn btn-outline-danger" onClick={()=> navigate("/login", {state: "/cart"})}>
                      Login to Checkout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
