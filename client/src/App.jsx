import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Menu from "./components/nav/Menu.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import PrivateRoute from './components/routes/PrivateRoute.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Menu/>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />       
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

