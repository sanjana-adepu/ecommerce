import {useState, useEffect} from 'react';
import Jumbotron from "../components/cards/Jumbotron.jsx";
import ProductCard from "../components/cards/ProductCard.jsx"
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {Badge} from 'antd';
import { FaCheck, 
        FaDollarSign, 
        FaProjectDiagram,
        FaRegClock,
        FaRocket,
        FaTimes,
        FaWarehouse,
    } from "react-icons/fa";

export default function ProductView() {
    //state
    const [product, setProduct] = useState();
    const [related, setRelated] = useState();
    //hooks
    const params = useParams();

    useEffect(() => {
        if(params?.slug) loadProduct();
    }, [params?.slug]);

    const loadProduct = async (req,res) => {
        try{
            const {data} = await axios.get(`product/${params.slug}`);
            setProduct(data);
            loadRelated(data._id,data.category._id);
        }catch(err){
            console.log(err);
        }
    };

    const loadRelated = async (productId, categoryId) => {
        try{
            const {data} = await axios.get(`related-products/${productId}/${categoryId}`);
            setRelated(data);
        }catch(err){
            console.log(err);
        }
    }

    if (!product) return <div>Loading...</div>;

  return (
      <div className="container-fluid">
        <div className="row">
            <div className="col-md-9">
                <div className='card mb-3 hoverable'>       
                    <Badge.Ribbon text={`${product?.sold} sold`} color='red'>
                        <Badge.Ribbon 
                        text={`${product?.quantity >=1 ? `${product?.quantity - product?.sold} in stock` : 'Out of Stock'}`} 
                        color={product?.quantity >= 1 ? 'green' : 'gray'}
                        placement='start'
                        >
                            <img 
                            className='card-img-top'
                            src={`${import.meta.env.VITE_API}/product/photo/${product._id}`}
                            alt='product photo'
                            style={{height: '500px', width: '100%', objectFit: 'cover'}}
                            />
                        </Badge.Ribbon>
                    </Badge.Ribbon>
                    
                    <div className='card-body'>
                        <h1 className='fw-bold'>{product?.name}</h1>
                        <p className='card-text lead'>{product?.description}</p>
                    </div>

                    <div className="d-flex justify-content-between lead p-5 bg-light fw-bold">
                        <div>
                            <p className='fw-bold'>
                                <FaDollarSign/> Price:{" "}
                                {product?.price?.toLocaleString("INR",{
                                    style: 'currency',
                                    currency: 'INR'
                            })}</p>

                            <p className="fw-bold">
                                <FaProjectDiagram/> Category: {" "}
                                {product?.category?.name}
                            </p>

                            <p>
                                <FaRegClock/> Added: {" "}
                                {moment(product.createdAt).fromNow()}
                            </p>

                            <p>
                                {product?.quantity > 0 ? <FaCheck/> : <FaTimes/>}
                                {product?.quantity > 0 ? "In Stock" : "Out of stock"}
                            </p>

                            <p>
                                <FaWarehouse/> Available {product?.quantity - product?.sold}
                            </p>

                            <p>
                                <FaRocket/> Sold {product?.sold}
                            </p>
                        </div>
                    </div>

                    <button className='btn btn-outline-primary col card-button'
                    style={{borderBottomRightRadius: '5px'}}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className="col-md-3">
                <h2>Related Products</h2>
                <hr/>
                {related.length < 1 && <p>Nothing found</p>}
                {related?.map((p) => (
                    <ProductCard p={p} key={p._id}/>
                ))}
            </div>
        </div>
      </div>
  )
}
