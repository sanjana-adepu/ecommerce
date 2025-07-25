import Jumbotron from '../../components/cards/Jumbotron.jsx';
import {useAuth} from '../../context/auth.jsx';
import {NavLink} from 'react-router-dom';
import AdminMenu from '../../components/nav/AdminMenu.jsx';

export default function AdminDashboard() {
    const [auth,setAuth] = useAuth();

  return (
    <>
        <Jumbotron title={`Hello ${auth?.user?.name}`}
        subTitle = "Admin Dashboard"/>

        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-3'>
              <AdminMenu/>
            </div>

            <div className="col-md-9">
              <div className="p-3 mt-2 mb-2 h4 bg-light">Admin Information</div>

              <ul className='list-group'>
                <li className='list-group-item'> {auth?.user?.name}</li>
                <li className='list-group-item'> {auth?.user?.email}</li>
                <li className='list-group-item'> Admin </li>                
              </ul>
            </div>
          </div>
        </div>
    </>
  )
}
