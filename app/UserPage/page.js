'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Star } from 'lucide-react';
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ComplaintForm from '@/components/ComplaintForm';
import Router from 'next/navigation';
import Spinner from '@/components/Spinner';
import Image from 'next/image';
const UserPage = () => {
  const { user, isAuthenticated, isLoading, getPermission } = useKindeAuth();
  const [complaint, setcomplaint] = useState(false)
  const [cancreateticket, setcancreateticket] = useState(null)
  const [expand, setexpand] = useState(false)
  const [loading, setloading] = useState(false)
  const [expanded, setexpanded] = useState(null)
  const [review, setreview] = useState('')

  const router = useRouter()
  const [comp, setcomp] = useState([])
  const arr = [1, 2, 3, 4, 5]
  const [rating, setrating] = useState(0)
  console.log(isAuthenticated)
  console.log(user)
  const [ratings, setRatings] = useState({}); // { complaintId: number }
  const [reviews, setReviews] = useState({}); // { complaintId: string }

  // Added a call back so that the a new comlint can be see at the top
  const addComplaint = (newComplaint) => {
    setcomp((prev) => [newComplaint, ...prev]); // add new complaint at top
  };

  const handleRating = (id, value) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
  };

  const handleReviewChange = (id, value) => {
    setReviews((prev) => ({ ...prev, [id]: value }));
  };

  const rated = async (item) => {
    let obj = {
      main: item?.main,
      sub: item?.sub,
      description: item?.description,
      rate: ratings[item._id] || 0,
      comment: reviews[item._id] || "",
    };

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });

    await fetch("/api/deleteRes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item?._id),
    });

    setcomp((prev) => prev.filter((i) => i?._id !== item?._id));
  };

  const isComp = () => {
    setcomplaint(!complaint)
  }
  const collapse = (id) => {

    setexpanded(expanded === id ? null : id)
  }
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])


  useEffect(() => {
    if (isAuthenticated) {
      const permission = getPermission('create:ticket');
      console.log(permission)
      setcancreateticket(permission?.isGranted || false);
      // setrole(claim?.value?.[0]?.name)
    }
  }, [isAuthenticated, UserPage]);


  useEffect(() => {
    const fetcher = async () => {
      setloading(true)
      const data = await fetch('api/getcomplaint')
      const res = await data.json()
      setcomp(res?.complaints)
      setloading(false)
    }
    fetcher()
  }, [])


  if (!isAuthenticated) {
    return null
  }


  return (
    <div>
      {isAuthenticated && cancreateticket ? (<><nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setexpand(!expand)}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                {/* Simple hamburger icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {expand && (
              <div className="md:hidden mt-30 ml-7 space-y-2 bg-white px-4 py-2 shadow rounded-lg absolute z-10">
                <Link href="/UserPage" className="block text-gray-700 hover:text-indigo-600">Dashboard</Link>
                
                <Link href="/userResolved" className="block text-gray-700 hover:text-indigo-600">Resolved Complaint</Link>
                <Link href="/communityUpdate" className="block text-gray-700 hover:text-indigo-600">Community Updates</Link>
              </div>
            )}
            {/* Left: Logo / App Name */}
            <div className="flex-shrink-0 text-xl font-bold text-indigo-600">
              CIVIC_Pulse 🛡️
            </div>

            {/* Center: Nav Links */}
            <div className="hidden md:flex space-x-8">
              <Link href="/UserPage" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              
              <Link href="/userResolved" className="text-gray-700 hover:text-indigo-600">
                Resolved Complaint
              </Link>
              <Link href="/communityUpdate" className="text-gray-700 hover:text-indigo-600">
                Community Updates
              </Link>
            </div>




            {/* Right: Profile / Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Hi, {user?.given_name.replace(/"/g, "&quot;")}
              </span>
              <LogoutLink postLogoutRedirectURL= '/'  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Logout
              </LogoutLink>
            </div>
          </div>
        </div>
      </nav>
        <div>
          <section className="relative z-10 flex flex-col items-center justify-center py-16 gap-10 text-center">
            {/* Welcome message */}
            <h1 className="text-4xl md:text-5xl font-bold font-mono">
              👋 Welcome back, <span className="text-green-300">{user?.given_name}!</span>
            </h1>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/4 max-w-4xl">
              {/* Complaints filed */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col items-center text-white hover:scale-105 transition-transform duration-200">
                <span className="text-4xl">📝</span>
                <h2 className="text-xl font-semibold mt-2 text-black">Complaints Filed</h2>
                <p className="text-3xl font-bold text-black">{comp.length}</p>
              </div>

              {/* Pending */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col items-center text-white hover:scale-105 transition-transform duration-200">
                <span className="text-4xl">⏳</span>
                <h2 className="text-xl font-semibold mt-2 text-amber-300">Pending</h2>
                <p className="text-3xl font-bold text-yellow-300">{comp.length}</p>
              </div>
            </div>
          </section>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-6">
          <h1 className='md:text-4xl text-center font-mono text-xl'>
            🤝 &ldquo;Join hands in building a safer, cleaner community.&rdquo;
          </h1>

          {/* File Complaint Button */}
          {complaint && <ComplaintForm onComplaintAdded={addComplaint} />}
          <button className="w-full py-3 rounded-xl bg-green-500 text-white font-medium shadow hover:bg-green-600 transition cursor-pointer" onClick={isComp}>
            ➕ File New Complaint
          </button>
        </div>

        <div>
          <h1 className='text-center font-mono font-extrabold md:text-4xl mt-15 text-2xl'>List of complaints</h1>
          <div className='md:grid md:grid-cols-3 gap-5 mt-10 md:px-20 grid grid-cols-1 px-10'>
            {loading ? (<Spinner />) : (comp.length === 0 ? (<p className='text-center font-mono'>No complaints registered</p>) : (Array.isArray(comp) && comp?.map(item => {
              return (<div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition" key={item?._id}>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Title & Category */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{item?.main}</h3>
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                      Category: {item?.sub}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm">{item?.description}</p>

                  {/*Dropdown*/}
                  <button className="flex items-center gap-2 text-green-600 font-medium text-sm transition-all duration-300 ease-in-out" onClick={() => collapse(item._id)}>
                    {expanded === item._id ? "Hide Image" : "Show Image"}
                    {expanded === item._id ? (<ChevronUp size={16} />) : (<ChevronDown size={16} />)}
                  </button>

                  {expanded === item._id && item?.imgurl && (
                    <div className="w-full h-48 overflow-hidden transition-all duration-300">
                      <Image
                        src={item.imgurl}
                        alt="no img"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />

                    </div>
                  )}
                  <div className="text-center">
                    {item?.status === "Resolved" && <><span className='text-lg font-bold font-mono mt-2 text-green-400'>🟢{item?.status}</span>

                      <h1 className="text-mono">Rate the service</h1>
                      <div className="flex justify-center items-center gap-5 mt-5">
                        {arr.map((star) => (
                          <div key={star}>
                            <Star
                              className={`${star <= (ratings[item._id] || 0)
                                ? "text-yellow-300"
                                : "text-black"
                                } text-xl gap-2 hover:scale-130 transition-all ease-in-out duration-150 cursor-pointer`}
                              onClick={() => handleRating(item._id, star)}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 justify-center items-center mt-5">
                        <input
                          type="text"
                          value={reviews[item._id] || ""}
                          onChange={(e) => handleReviewChange(item._id, e.target.value)}
                          placeholder="Tell us about the service....."
                        />
                        <button
                          onClick={() => rated(item)}
                          className="font-mono bg-green-400 p-2 rounded-2xl cursor-pointer"
                        >
                          Post
                        </button>
                      </div>


                    </>
                    }
                    {item?.status === "Pending" && <span className='text-lg font-bold font-mono mt-2 text-red-500'>🔴{item?.status}</span>}
                    {item?.status === "Failed" && <span className='text-lg font-bold font-mono mt-2 text-yellow-400'>🟡{item?.status}</span>}
                  </div>
                </div>
              </div>)
            })))}
          </div>
        </div>
        <footer className="w-full text-center text-lg text-white py-8 bg-green-500 mt-20">
          © 2025 Civic_Pulse. All rights reserved.
        </footer>
      </>) : (<p className="text-center mt-20 text-xl font-mono text-red-500">
        You do not have the right permission
      </p>)}


    </div >
  )
}

export default UserPage



