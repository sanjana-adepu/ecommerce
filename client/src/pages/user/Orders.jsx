import Jumbotron from '../../components/cards/Jumbotron.jsx';
import {useAuth} from '../../context/auth.jsx';
import UserMenu from '../../components/nav/UserMenu.jsx';

export default function Orders() {
    const [auth,setAuth] = useAuth();

  return (
    <>
        <Jumbotron title={`Hello ${auth?.user?.name}`}
        subTitle = "Dashboard"/>

        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-3'>
              <UserMenu/>
            </div>

            <div className="col-md-9">
              <div className="p-3 mt-2 mb-2 h4 bg-light">Orders</div>

              User orders history..
            </div>
          </div>
        </div>
    </>
  )
}
