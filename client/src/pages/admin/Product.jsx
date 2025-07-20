import Jumbotron from '../../components/cards/Jumbotron.jsx';
import {useAuth} from '../../context/auth.jsx';
import {NavLink} from 'react-router-dom';
import AdminMenu from '../../components/nav/AdminMenu.jsx';

export default function AdminProduct() {
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
              <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Products</div>

              <p>Create product form</p>
            </div>
          </div>
        </div>
    </>
  )
}
