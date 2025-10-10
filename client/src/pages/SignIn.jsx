import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// redux 
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInFailed, signInSuccess } from '../redux/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'

const SignIn = () => {

  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })

    console.log(formData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
    console.log("Dispatched: signInStart");

      const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log(data);

    if (data.success === false) {
      dispatch(signInFailed(data.message));
      console.log("Dispatched: signInFailed");

      return;
    }
    dispatch(signInSuccess(data));
    console.log("Dispatched: signInSuccess");
    navigate('/');
      
    } catch (error) {
      dispatch(signInFailed(error.message));
    }
    
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold'>Sign In</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          
          <input type="email" placeholder="Email"  className='border p-3 rounded-lg' id='email' onChange={handleChange} />
          
          <input type="password" placeholder="Password"  className='border p-3 rounded-lg' id='password' onChange={handleChange} />

          <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        <OAuth />
        </form>

        <div className='flex gap-2 mt-5'>
          <p>Dont have an account?</p>
          <Link to={"/sign-up"} >
          <span className='text-blue-700'>Sign Up</span></Link>
        </div>

        {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}

export default SignIn