import {useState, useEffect} from 'react';
import {useAuth} from "../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import Jumbotron from '../components/cards/Jumbotron.jsx';
import axios from 'axios';
import ProductCard from '../components/cards/ProductCard.jsx';
import { Checkbox, Radio } from 'antd';
import {prices} from '../prices.jsx';

export default function Shop() {
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [auth, setAuth] = useAuth();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!checked.length || !radio.length) loadProducts();
    }, []);

    useEffect(() => {
        if(checked.length || radio.length){
            loadFilteredProducts();
        }
    }, [checked, radio]);

    const loadFilteredProducts = async () => {
        try{
            const {data} = await axios.post('/filtered-products',{checked, radio});
            console.log('filteredProducts => ', data);
            setProducts(data);
        }catch(err){
            console.log(err);
        }
    };

    const loadProducts = async () => {
        try {
            const {data} = await axios.get('/products');
            setProducts(data);
        } catch (error) {
            console.log(error);
            
        }
    };

    const handleCheck = (id, value) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter(c => c !== id);
        }
        setChecked(all);
        // filterProducts(all);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const {data} = await axios.get('/categories');
            setCategories(data);
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <h1>
        <Jumbotron title="Hello" subTitle='Welcome to React E-Commerce'/>

        {/* <pre>{JSON.stringify(radio, null, 4)}</pre> */}

        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3'>
                    <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>
                        Filter by Category
                    </h2>
                    <div className='row p-5'>
                        {categories?.map(c => (
                            <Checkbox
                            key={c._id}
                            onChange={(e) => handleCheck(c._id, e.target.checked)}
                            >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>
                        Filter by Prices
                    </h2>
                    <div className='row p-5'>
                        <Radio.Group onChange={e  => setRadio(e.target.value)}>
                            {prices?.map(p => (
                                <div key={p._id} style={{marginLeft: "8px"}}>
                                    <Radio value={p.array}>
                                    {p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="p-5 pt-0">
                        <button className='btn btn-outline-secondary col-12' 
                        onClick={() => window.location.reload()}
                        >
                            Reset
                        </button>
                    </div>
                </div>
                <div className='col-md-9'>
                    <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>{products?.length} Products</h2>
                    <div className='row' style={{height: '100vh', overflow: 'scroll'}}>
                        {products?.map(p => (
                            <div className='col-md-4 mb-3' key={p._id}>
                                <ProductCard p={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </h1>
  )
}
