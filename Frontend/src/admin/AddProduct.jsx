import React, { useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AddProduct() {
     const [form ,setform] = useState({
        title :"",
        description : "",
        price : "",
        category : "",
        image : "",
        stock : ""
     })
     const navigate = useNavigate()
     const [msg,setmsg] = useState()

   async function handleChnage(e) {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  }

async function handleSubmit(e) {
  e.preventDefault();

  try {
    const response = await api.post("/product/add", form);

    toast.success("Product Added Successfully!")
    navigate("/admin/product");
  } catch (error) {
    console.log(error.response?.data);
    setmsg(error.response?.data?.message || "An Error Occured");
  }
}
     
  return (
    <div className=' max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded '>
        <h2 className=' text-2xl font-bold mb-6'> Add New Product</h2>

{msg && <p className="text-red-500 mb-3">{msg}</p>}

        <form onSubmit={handleSubmit} className='space-y-3'>
            {
              Object.keys(form).map((key) => (
  <input
    key={key}
    name={key}
    value={form[key]}
    onChange={handleChnage}
    placeholder={key}
    className="w-full p-2 border border-gray-300 rounded"
  />
))
            }
            <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>Add To Product</button>
        </form>
      
    </div>
  )
}
