import {NavLink} from 'react-router-dom';
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import Search from '../forms/Search.jsx';
import useCategory from '../../hooks/useCategory.jsx';
import {useCart} from '../../context/cart.jsx';
import {Badge} from 'antd';

export default function Menu() {
  //hooks
  const {categories} = useCategory();
  const [cart, setCart] = useCart();
  //context
  const[auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setAuth({...auth, user:null, token:""});
    localStorage.removeItem("auth"); //removes automatically but only after reloading, we want quick action
    navigate('/login');
  }
  return (
    <>
     <ul className="nav d-flex justify-content-between shadow-sm mb-2 sticky-top bg-light">
      <li className="nav-item">
        <NavLink className="nav-link" aria-current="page" to="/">HOME</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" aria-current="page" to="/shop">SHOP</NavLink>
      </li>

      <div className='dropdown'>
        <li>
          <a className="nav-link poiner dropdown-toggle" data-bs-toggle="dropdown">
            Categories
          </a>

          <ul className='dropdown-menu' style={{height: '300px', overflow: 'scroll'}}>
              <NavLink className='nav-link' to={`/categories`}>
                All Categories
              </NavLink>
            {categories?.map(c => {
              return (
                <li key={c._id}>
                  <NavLink className='nav-link' to={`/category/${c.slug}`}>
                    {c.name}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </li>         
      </div>
      <li className="nav-item mt-1">
        <Badge count={cart?.length >=1 ? cart.length : 0} offset={[-5,11]} showZero={true}>
          <NavLink className="nav-link" aria-current="page" to="/cart">
            CART
          </NavLink>
        </Badge>
      </li>

      <Search/>
      
      {!auth?.user ? (
        <>
        <li className="nav-item">
          <NavLink className="nav-link" to="/login">LOGIN</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/register">REGISTER</NavLink>
        </li>
      </>
      ) : (
        <div className='dropdown'>

          <li>
            <a className="nav-link poiner dropdown-toggle" data-bs-toggle="dropdown">
              {auth?.user?.name?.toUpperCase()}
            </a>

            <ul className='dropdown-menu'>
              <li>
                <NavLink  className='nav-link' to={`/dashboard/${auth?.user?.role === 1 ? 'admin':'user'}`}>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item pointer">
                <a onClick={logout} className='nav-link'>LOGOUT</a>
              </li>
            </ul>
          </li>         
        </div>
      )}     
    </ul>
    </>
  )
}
