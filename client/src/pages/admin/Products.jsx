import Jumbotron from '../../components/cards/Jumbotron.jsx';
import {useAuth} from '../../context/auth.jsx';
import {NavLink} from 'react-router-dom';
import AdminMenu from '../../components/nav/AdminMenu.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {Link} from 'react-router-dom';
import moment from 'moment';

export default function AdminProducts() {
    const [auth,setAuth] = useAuth();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const {data} = await axios.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

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
              <div className="p-3 mt-2 mb-2 h4 bg-light">Products</div>
              {products?.map((product) => (
                <Link key={product?._id} to={`/dashboard/admin/product/update/${product?.slug}`}>
                    <div className="card mb-3">
                        <div className='row g-0'>
                            <div className='col-md-4'>
                                <img 
                                    src={`${import.meta.env.VITE_API}/product/photo/${product?._id}`} 
                                    className='img img-fluid rounded-start' 
                                    alt={product?.name} 
                                    width="100%"
                                    height="50px"
                                    />
                            </div>
                            <div className='col-md-8'>
                              <div className='card-body'>
                                <h5 className='card-title'>{product?.name}</h5>
                                <p className='card-text'>{product?.description?.substring(0,160)}...</p>
                                <p className='card-text'>
                                  <small className='text-muted'>
                                    {moment(product?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                  </small>
                                </p>
                              </div>
                            </div>
                        </div>
                    </div>
                </Link>
               ))}
            </div>
          </div>
        </div>
    </>
  )
}
