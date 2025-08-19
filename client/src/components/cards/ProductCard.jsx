import moment from 'moment';
import {Badge} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useCart} from '../../context/cart.jsx';
import toast from 'react-hot-toast';

export default function ProductCard({p}) {
    //context
    const [cart, setCart] = useCart();
    //hooks
    const navigate = useNavigate();

  return (
    <div className='card mb-3 hoverable' key={p._id}>
        
        <Badge.Ribbon text={`${p?.sold} sold`} color='red'>
            <Badge.Ribbon 
            text={`${p?.quantity >=1 ? `${p?.quantity - p?.sold} in stock` : 'Out of Stock'}`} 
            color={p?.quantity >= 1 ? 'green' : 'gray'}
            placement='start'
            >
                <img 
                className='card-img-top'
                src={`${import.meta.env.VITE_API}/product/photo/${p._id}`}
                alt='product photo'
                style={{height: '300px', objectFit: 'cover'}}
                />
            </Badge.Ribbon>
        </Badge.Ribbon>
        <div className='card-body'>
            <h5>{p?.name}</h5>

            <h4 className='fw-bold'>{p?.price?.toLocaleString("INR",{
                style: 'currency',
                currency: 'INR'
            })}</h4>
            <p className='card-text'>{p?.description?.substring(0,60)}...</p>
            <p className='card-text'>{moment(p.createdAt).fromNow()}</p>
        </div>

        <div className='d-flex justify-content-between'>
            <button className='btn btn-primary col card-button' 
            style={{borderBottomLeftRadius: '5px'}}
            onClick={() => navigate(`/product/${p.slug}`)}>
                View product
            </button>

            <button 
                className='btn btn-outline-primary col card-button'
                style={{borderBottomRightRadius: '5px'}}
                onClick={() => {
                    setCart([...cart,p]);
                    localStorage.setItem('cart', JSON.stringify([...cart,p]));
                    toast.success('Added to cart');
                }}
            >
                Add to Cart
            </button>
        </div>
    </div>
  )
}
