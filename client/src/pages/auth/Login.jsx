import { useState } from 'react';
import Jumbotron from '../../components/cards/Jumbotron.jsx';
import axios from 'axios';
import toast, {Toaster} from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post(
        `${import.meta.env.VITE_API}/login`, 
        {
          email,
          password,
        }
      );
        console.log(data);
        if(data?.error){
          toast.error(data.error);       
        }else{
          toast.success('Login successful');
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

