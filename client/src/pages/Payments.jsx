import React from 'react'
import { LuMail } from 'react-icons/lu'
import { BsPhone } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaInstagram } from 'react-icons/fa';
import { BiLogoFacebook } from 'react-icons/bi';
import { AiOutlineLinkedin } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Whatsapp from '../components/Whatsapp';
import Payment from '../components/Payment';

const Payments = () => {


  return (
    <main className='bg-[#04364A] p-6 md:p-16 my-0 md:my-10 max-w-6xl rounded-none md:rounded-lg mx-auto text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-00'>
      <div className='flex flex-col gap-6'>
        <p className='font-[Kodchasan] text-5xl'>Lets talk <br /> on something <span className='text-[#64CCC5]'>great</span> <br /> together</p>

        {/* email, phone number and more  */}
        <div className='flex flex-col gap-4 text-sm'>
          <div className='flex items-center gap-4'>
            <LuMail size={22}  className='text-[#64CCC5]'/>
            <p>example@example.com</p>
          </div>

          <div className='flex items-center gap-4'>
            <BsPhone size={22}  className='text-[#64CCC5]'/>
            <p>+234 907 216 6300</p>
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
    

        <Payment />
    </main>
  )
}

export default Payments