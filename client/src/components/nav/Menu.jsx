import {NavLink} from 'react-router-dom';
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import Search from '../forms/Search.jsx';
import useCategory from '../../hooks/useCategory.jsx';
import {Link} from 'react-router-dom';

export default function Menu() {
  //hooks
  const {categories} = useCategory();
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
     <ul className="nav d-flex justify-content-between shadow-sm mb-2">
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
              {auth?.user?.name}
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
