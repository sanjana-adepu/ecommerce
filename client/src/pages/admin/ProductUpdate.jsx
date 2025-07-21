import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Select } from 'antd';
import Jumbotron from '../../components/cards/Jumbotron.jsx';
import {useAuth} from '../../context/auth.jsx';
import AdminMenu from '../../components/nav/AdminMenu.jsx';

const { Option } = Select;

export default function AdminProductUpdate() {
  //context
  const [auth,setAuth] = useAuth();
  //state
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");
  //hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    loadProducts();
}, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
      try {
        const {data} = await axios.get('/categories');
        setCategories(data);
      } catch(error) {
        console.error("Error loading categories:", error);
        toast.error("Failed to load categories");
      }
  };

  const loadProducts = async () => {
    try {
        const {data} = await axios.get(`/product/${params.slug}`);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setQuantity(data.quantity);
        setCategory(data.category._id);
        setShipping(data.shipping);
        setPhoto(data.photo);
        setId(data._id);
    } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
    }
    };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('quantity', quantity);
      productData.append('category', category);
      productData.append('shipping', shipping);
      photo && productData.append('photo', photo);

      const {data} = await axios.put(`/product/${id}`, productData);

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Product created successfully");
        navigate('/dashboard/admin/products');
        window.location.reload();
        // setName("");
        // setDescription("");
        // setPrice("");
        // setQuantity("");
        // setCategory("");
        // setShipping("");
        // setPhoto("");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }};

    const handleDelete = async (e) => {
      e.preventDefault();
      try {
        let answer = window.confirm("Are you sure you want to delete this product?");
        if (!answer) return;
        const {data} = await axios.delete(`/product/${id}`);
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.success("Product deleted successfully");
          navigate('/dashboard/admin/products');
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    };

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
              <div className="p-3 mt-2 mb-2 h4 bg-light">Update Product</div>

              {photo ? (
                <div className='text-center'>
                  <img 
                  src={URL.createObjectURL(photo)} 
                  alt='product photo' 
                  className='img img-responsive'
                  height="200px"
                  />
                </div>
              ):(
                <div className='text-center'>
                  <img 
                  src={`${import.meta.env.VITE_API}/product/photo/${id}?${new Date().getTime()}`} 
                  alt='product photo' 
                  className='img img-responsive'
                  height="200px"
                  />
                </div>
              )}

              <div className='pt-2'>
                <label className='btn btn-outline-secondary col-12 mb-3'>
                  {photo ? photo.name : 'Upload photo'}
                  <input
                    type="file"
                    name='photo'
                    accept='image/*'
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <input 
                type="text" 
                className='form-control mb-3' 
                placeholder='Write product name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <textarea 
                type="text" 
                className='form-control p-3 mb-3' 
                placeholder='Write a description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
                <input 
                type="number" 
                className='form-control mb-3' 
                placeholder='Write a price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
                
              <Select
              showSearch
              variant={false}
              size='large'
              className='form-select mb-3'
              placeholder='Select a category'
              // Set selected value and update state with category _id
              value={category}
              onChange={(value) => setCategory(value)}
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <Select
              showSearch
              variant={false}
              size='large'
              className='form-select mb-3'
              placeholder='Choose shipping '
              onChange={(value) => setShipping(value)}
              value={shipping ? "Yes" : "No"}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>

              <input 
                type="number"
                min='1' 
                className='form-control p-2 mb-3' 
                placeholder='Enter quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                />

                <div className='d-flex justify-content-center gap-3'>
                    <button onClick={handleUpdate} className='btn btn-primary mb-5'>
                        Update
                    </button>
                    <button onClick={handleDelete} className='btn btn-danger mb-5'>
                        Delete
                    </button>
                </div>

            </div>
          </div>
        </div>
    </>
  )
}
