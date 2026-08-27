import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function OderSuccess() {
    const {id} = useParams()
    const navigate =  useNavigate()
    
    function goHome() {
        navigate("/home")
    }
  return (
    <div className='max-w-xl mx-auto p-6 text-center'>
        <h1 className='text-3xl font-bold text-green-600'>Order Placed Successfully</h1>

        <p className='mt-4'>Your Order Id  
        <span className='font-semibold '> {id} </span>
      </p>

      <button onClick={goHome} className='inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded'> Coutinue Shopping </button>
    </div>
  )
}
