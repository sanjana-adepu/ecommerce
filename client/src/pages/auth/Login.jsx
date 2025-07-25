import { useState } from 'react';
import Jumbotron from '../../components/cards/Jumbotron.jsx';
import axios from 'axios';
import toast, {Toaster} from "react-hot-toast";
import {useAuth} from "../../context/auth.jsx";
import {useNavigate, useLocation} from "react-router-dom";

export default function Login() {
  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //hook
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post(`/login`, 
        {
          email,
          password,
        }
      );
        console.log(data);
        if(data?.error){
          toast.error(data.error);       
        }else{
          localStorage.setItem('auth', JSON.stringify(data));
          setAuth({...auth,token: data.token, user: data.user});
          toast.success('Login successful');
          // Use data.user.role directly instead of auth?.user?.role
          navigate(`/dashboard/${data?.user?.role === 1 ? 'admin':'user'}`);
        }
      }catch(err){
        console.log(err);
        toast.error("Login failed. Try again.");
      }
  }

  return (
    <div>
      <Jumbotron title="Login"/>
      <Toaster/>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <form onSubmit={handleSubmit}>


              <input
                type="email"
                className='form-control mb-4 p-2'
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className='form-control mb-4 p-2'
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className='btn btn-primary' onClick={handleSubmit}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

