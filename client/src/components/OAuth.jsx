import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
      try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app)

        const result = await signInWithPopup(auth, provider);

        const res = fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            "Content-type": "aplication/json"
          },
          body: JSON.stringify({
            name : result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL
          })
        })

        const data = (await res).json();
        dispatch(signInSuccess(data))
        navigate('/')
        

      } catch (error) {
        console.log('Coulnt sig in with Google', error);
        
      }
    } 


  return (
    <button type='button' className="bg-red-700 p-3 rounded-lg text-white uppercase hover:opacity-95" onClick={handleGoogleClick}>Continue With Google</button>
  )
}

export default OAuth