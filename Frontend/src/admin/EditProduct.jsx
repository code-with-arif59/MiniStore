import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function EditProduct() {
   const {id} =  useParams()
   const  navigate = useNavigate()
 const [form,setform] = useState({
         title :"",
        description : "",
        price : "",
        category : "",
        image : "",
        stock : ""
 })

 const allowedFields = ['title','description', 'price','category','image','stock']

async function loadproduct() {
    const response = await api.get("/product")

    const product = response.data.products.find((p)=> p._id === id);
    console.log(product,"product");
    setform(product)
}

 useEffect(()=>{
loadproduct();
 },[])

   
   async function handleChnage(e) {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  }

    async function handleSubmit(e) {
    e.preventDefault();
    await api.put(`/product/update/${id}`,form)
    toast.success("update product✅")
    navigate("/admin/product")

  }
 
  return (
    <div className='max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded border border-gray-300'>
        <h2 className='text-2xl font-boldm mb-6'>Edit Product</h2>
      
           <form onSubmit={handleSubmit} className='space-y-3 bor'>
            {allowedFields.map((key)=>(
                allowedFields.includes(key) &&
                <input key={key} name= {key}    value={form[key] || ""}  onChange={handleChnage} placeholder= {key} className='w-full p-2 border border-gray-300 rounded'/>
            ))}
            <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>Update Product</button>
           </form>
    </div>
  )
}
