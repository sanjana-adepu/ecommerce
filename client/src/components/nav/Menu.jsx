import {NavLink} from 'react-router-dom';
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import Search from '../forms/Search.jsx';

export default function Menu() {
  //hooks
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

      <Search/>
      {/* <li className="nav-item">
        <NavLink className="nav-link" aria-current="page" to="/dashboard/secret">SECRET</NavLink>
      </li> */}
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
