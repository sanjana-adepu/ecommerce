import Jumbotron from '../components/cards/Jumbotron.jsx'
import axios from 'axios';
import {useState, useEffect} from 'react';
import moment from 'moment';
import ProductCard from '../components/cards/ProductCard.jsx';

export default function Home() {
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
  };

  const arr = [...products];
  const sortedBySold = arr.sort((a, b) => (a.sold < b.sold ? 1 : -1));

  return (
    <div>
      <Jumbotron title="Hello" subTitle='Welcome to React E-Commerce'/>

      <div className='row'>
        <div className='col-md-6'>
          <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>New arrivals</h2>
          <div className='row'>
            {products?.map(p => (
            <div className='col-md-6'>
              <ProductCard p ={p}/>
            </div>
          ))}
          </div>
        </div>

        <div className='col-md-6'>
          <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>Best Sellers</h2>
          <div className='row'>
            {products?.map(p => (
            <div className='col-md-6'>
              <ProductCard p ={p}/>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
