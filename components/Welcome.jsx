'use client'

import React from 'react'
import { FcGoogle } from 'react-icons/fc'       // Google
import { FaTwitter, FaGithub } from 'react-icons/fa' // Twitter, GitHub
import { HiOutlineMail } from 'react-icons/hi'  // Mail
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";


const Welcome = () => {
  return (
    <div className='relative min-h-screen'>
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover blur-xs"
        autoPlay
        muted
        loop
        playsInline
      >
        {/* ⚡ Use direct .mp4 link, not the Pexels page */}
        <source
          src="https://www.pexels.com/download/video/3121459/"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Foreground content */}
      <div className='relative z-10'>
        {/* Navbar */}
        <nav className='md:flex md:justify-between md:items-center md:px-20 md:py-10 flex justify-around py-10 items-center'>
          <h1 className='md:text-3xl font-mono font-bold text-white text-lg'>
            Civic_PULSE
          </h1>
          <div className='flex justify-between items-center gap-3'>
            <LoginLink
              postLoginRedirectURL="/UserPage"
              className='text-sm font-mono border p-2 rounded-4xl text-white cursor-pointer hover:bg-green-200 transition-all ease-in-out duration-150 hover:text-black'
            >
              User Login
            </LoginLink>


            <LoginLink postLoginRedirectURL='/StaffPage' className='text-sm font-mono border p-2 rounded-4xl text-white cursor-pointer hover:bg-green-200 transition-all ease-in-out duration-150 hover:text-black'>
              Admin Login
            </LoginLink>

          </div>
        </nav>

        {/* Hero Section */}
        <div className='flex justify-center items-center flex-col md:py-30 gap-5 py-20'>
          <h1 className='md:text-5xl font-mono text-white w-3/4 text-center text-2xl'>
            "Making Neighborhoods Better, One Complaint at a Time"
          </h1>

          {/* ✅ FIXED hydration-safe text */}
          <p className='md:text-3xl font-mono text-white flex items-center gap-3 mt-2 text-sm'>
            Empowering <span className='text-green-300'>Citizens,</span>
            Enhancing <span className='text-green-400'>Communities.</span>
          </p>

          <p className='md:text-2xl font-mono text-xl'>Login & Solve It</p>

          {/* Social Icons */}
          <div className='flex justify-center items-center relative gap-10 text-5xl'>
            <LoginLink postLoginRedirectURL="/UserPage"> <FcGoogle className='bg-white rounded-xl px-1 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer' /></LoginLink>
            <LoginLink
              postLoginRedirectURL="/UserPage"><FaGithub className='bg-gray-200 rounded-xl px-1 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer' /></LoginLink>
            <LoginLink
              postLoginRedirectURL="/UserPage"><FaTwitter className='bg-blue-400 rounded-xl px-1 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer' /></LoginLink>
            {/* <HiOutlineMail className='bg-white rounded-xl px-1 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer' /> */}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center text-lg text-white py-8">
          © 2025 Civic_Pulse. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default Welcome
