import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Jumbotron from '../../components/cards/Jumbotron.jsx';
import {useAuth} from '../../context/auth.jsx';
import AdminMenu from '../../components/nav/AdminMenu.jsx';
import CategoryForm from '../../components/forms/CategoryForm.jsx';
import {Modal} from 'antd';

export default function AdminCategory() {
    const [auth,setAuth] = useAuth();
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatingName, setUpdatingName] = useState("");

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
          const {data} = await axios.post("/category", {name});
          if(data?.error){
            toast.error(data.error);
          }else{
            loadCategories();
            setName("");
            toast.success(`Category "${data.name}" created successfully`);
          }
        }catch (error) {
          console.error("Error submitting category:", error);
          toast.error("Failed to create category");
        }
    };

    const handleUpdate = async (e) =>{
      e.preventDefault();
      try{
        const { data } = await axios.put(`/category/${selected._id}`, {
          name: updatingName,
        });
        if(data?.error){
          toast.error(data.error);
        } else {
          toast.success(`Category "${data.name}" updated successfully`);
          setSelected(null);
          setUpdatingName("");
          loadCategories();
          setIsModalOpen(false);
        }
      }catch(error) {
        console.error("Error updating category:", error);
        toast.error("Category may already exist");
      }
    };

    const handleDelete = async (e) =>{
      e.preventDefault();
      try{
        const { data } = await axios.delete(`/category/${selected._id}`);
        if(data?.error){
          toast.error(data.error);
        } else {
          toast.success(`Category "${data.name}" deleted successfully`);
          setSelected(null);
          loadCategories();
          setIsModalOpen(false);
        }
      }catch(error) {
        console.error("Error deleting category:", error);
        toast.error("Category may already exist");
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
              <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>

              <CategoryForm value={name} setValue={setName} handleSubmit={handleSubmit}/>

              <hr/>
              
              <div className='col'>
                {categories.map((c) => (
                    <button 
                    key={c._id} 
                    className='btn btn-outline-primary m-3' 
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelected(c);
                      setUpdatingName(c.name);
                    }}>
                      {c.name}
                    </button>
                ))}
              </div>

              <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
              >
                <CategoryForm 
                  value={updatingName} 
                  setValue={setUpdatingName} 
                  handleSubmit={handleUpdate}
                  buttonText="Update"
                  handleDelete={handleDelete}
                />
              </Modal>

            </div>
          </div>
        </div>
    </>
  )
}
