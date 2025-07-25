import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Select } from 'antd';
import Jumbotron from '../../components/cards/Jumbotron.jsx';
import {useAuth} from '../../context/auth.jsx';
import AdminMenu from '../../components/nav/AdminMenu.jsx';

const { Option } = Select;

export default function AdminProduct() {
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
  //hooks
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('quantity', quantity);
      productData.append('category', category);
      productData.append('shipping', shipping);
      productData.append('photo', photo);

      const {data} = await axios.post('/product', productData);

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Product created successfully");
        navigate('/dashboard/admin/products');
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
    }}

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
              <div className="p-3 mt-2 mb-2 h4 bg-light">Create Products</div>

              {photo && (
                <div className='text-center'>
                  <img 
                  src={URL.createObjectURL(photo)} 
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

                <button onClick={handleSubmit} className='btn btn-primary mb-5'>Submit</button>
            </div>
          </div>
        </div>
    </>
  )
}
