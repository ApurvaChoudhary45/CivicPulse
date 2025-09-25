'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from '@/components/Spinner';


const StaffPage = () => {
    const { user, isAuthenticated, isLoading, getPermission } = useKindeAuth();
    const [loading, setloading] = useState(false)
    const [expanded, setexpanded] = useState(null)
    const [compl, setcomp] = useState([])
    const [canViewTicket, setcanViewTicket] = useState(null)
    const [expand, setexpand] = useState(false)

    let router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/')
        }
    }, [isLoading, isAuthenticated, router])

    useEffect(() => {
        if (isAuthenticated) {
            const permission = getPermission('view:ticket');
            setcanViewTicket(permission?.isGranted || false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetcher = async () => {
            setloading(true)
            const data = await fetch('api/getresolved')
            const res = await data.json()
            // add localStatus for dropdown handling

            setcomp(res?.complaints)
            setloading(false)
        }
        fetcher()
    }, [])

    const collapse = (id) => {
        setexpanded(expanded === id ? null : id)
    }


    return (
        <div>
            {isAuthenticated && canViewTicket ? (
                <>
                    {/* Navbar */}
                    <nav className="bg-white shadow-md sticky top-0 z-50">
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
                                        <Link href="/StaffPage" className="block text-gray-700 hover:text-indigo-600">Dashboard</Link>

                                        <Link href="/resolvedComplaints" className="block text-gray-700 hover:text-indigo-600">Resolved Complaint</Link>

                                    </div>
                                )}
                                <div className="text-xl font-bold text-indigo-600">CIVIC_Pulse 🛡️</div>
                                <div className="hidden md:flex space-x-8">
                                    <Link href="/StaffPage" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>

                                    <Link href="/resolved-complaints" className="text-gray-700 hover:text-indigo-600">Resolved Complaints</Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700 font-medium">Hi, {user?.given_name}</span>
                                    <LogoutLink postLogoutRedirectURL="/" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                                        Logout
                                    </LogoutLink>
                                </div>
                            </div>
                        </div>
                    </nav>
                    {/* Complaints Table/List Placeholder */}
                    <div className="max-w-6xl mx-auto mt-12 px-6">
                        <h2 className="text-2xl font-bold mb-4">📋 Resolved Complaints</h2>
                        <div className="bg-white rounded-xl shadow p-6">
                            <p className="text-gray-500">List of Resolved Complaints.</p>
                        </div>
                    </div>

                    {/* Complaints */}
                    <div className='md:grid md:grid-cols-2 gap-10 md:px-20 mt-10 grid grid-cols-1 px-10'>
                        {loading ? <Spinner /> : (
                            compl.length === 0 ? (
                                <p className='text-center font-mono'>No complaints resolved</p>
                            ) : (
                                compl.map(item => (
                                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition" key={item?._id}>
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-800">{item?.main}</h3>
                                                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                                                    Category: {item?.sub}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm">{item?.description}</p>

                                            {/* Image toggle */}
                                            <button
                                                className="flex items-center gap-2 text-green-600 font-medium text-sm"
                                                onClick={() => collapse(item._id)}
                                            >
                                                {expanded === item._id ? 'Hide Image' : 'Show Image'}
                                                {expanded === item._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>

                                            {expanded === item._id && item?.imgurl && (
                                                <div className="w-full h-48 overflow-hidden transition-all duration-300">
                                                    <img src={item.imgurl} alt="no img" className="w-full h-full object-cover" />
                                                </div>
                                            )}

                                            {/* Status Dropdown */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status : Resolved</label>
                                                <div className='flex flex-col gap-5'>
                                                    <span className='text-xl font-mono'>Rating : {item?.rate}</span>
                                                    <span className='text-xl font-mono'>Comment : {item?.comment}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>

                    <footer className="w-full text-center text-lg text-white py-8 bg-indigo-600 mt-20">
                        © 2025 Civic_Pulse. Staff Dashboard
                    </footer>
                </>
            ) : (
                <p className="text-center mt-20 text-xl font-mono text-red-500">You do not have the right permission</p>
            )}
        </div>
    )
}

export default StaffPage
