import React from 'react'
import { Link } from 'react-router-dom';

const Whatsapp = () => {
  return (
    <Link to='https://wa.link/w90tk5'>
      <button className='bg-green-500 uppercase text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300'>Chat with us on whatsapp</button>
    </Link>
  )
}

export default Whatsapp