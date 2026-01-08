import React from 'react'
import { LuMail } from 'react-icons/lu'
import { BsPhone } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaInstagram } from 'react-icons/fa';
import { BiLogoFacebook } from 'react-icons/bi';
import { AiOutlineLinkedin } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Whatsapp from '../components/Whatsapp';

const Contact = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  return (
    <main className='bg-[#04364A] p-6 md:p-16 my-0 md:my-10 max-w-6xl rounded-none md:rounded-lg mx-auto text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-00'>
      <div className='flex flex-col gap-6'>
        <p className='font-[Kodchasan] text-5xl'>Lets talk <br /> on something <span className='text-[#64CCC5]'>great</span> <br /> together</p>

        {/* email, phone number and more  */}
        <div className='flex flex-col gap-4 text-sm'>
          <div className='flex items-center gap-4'>
            <LuMail size={22}  className='text-[#64CCC5]'/>
            <p>admin@caretakershub.org</p>
          </div>

          <div className='flex items-center gap-4'>
            <BsPhone size={22}  className='text-[#64CCC5]'/>
            <p>+234 810 640 5677</p>
          </div>

          <div className='flex items-center gap-4'>
            <HiOutlineLocationMarker size={22}  className='text-[#64CCC5]'/>
            <p>Lagos, Nigeria</p>
          </div>
        </div>

        <div className='flex items-center mt-4 gap-0'>
          <FaInstagram size={22} className='text-[#64CCC5]'/>
          <BiLogoFacebook size={22} className='text-[#64CCC5] ml-4'/>
          <AiOutlineLinkedin size={22} className='text-[#64CCC5] ml-4'/>
        </div>

        <Whatsapp />
      </div>


     {/* form  */}
    
        <form className='w-full md:w-1/2 bg-white text-[#176B87] p-2 md:p-6 rounded-sm md:rounded-3xl flex flex-col gap-4' >
          <div>
            <p>Your Name</p>
            <input type="text" placeholder='Enter your name' className='w-full p-3 rounded-md mt-2 text-black outline-none' name='name' id='name' value={name} onChange={(e) => setName(e.target.value)}/>
          </div>

          <div>
            <p>Email Address</p>
            <input type="email" placeholder='Enter your email' className='w-full p-3 rounded-md mt-2 text-black outline-none' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div>
            <p>Message</p>
            <textarea rows={4} placeholder='Write your message' className='w-full p-3 rounded-md mt-2 text-black outline-none' name='message' id='message' value={message} onChange={(e) => setMessage(e.target.value)}/>
          </div>

         
            

            <Link
                      to={`mailto:caretakerhub@gmail.com?subject=New Contact from ${name}&body=Name: ${name}%0DEmail: ${email}%0D%0DMessage:%0D${message}`}
                       className='bg-[#176B87] text-white px-6 py-3 rounded-full hover:bg-[#064856] transition-all duration-300'>Contact us         
                      </Link>

            
            
        </form>
    </main>
  )
}

export default Contact