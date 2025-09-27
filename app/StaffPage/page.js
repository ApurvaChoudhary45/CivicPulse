'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';

const StaffPage = () => {
  const { user, isAuthenticated, isLoading, getPermission } = useKindeAuth();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [comp, setComp] = useState([]);
  const [canViewTicket, setCanViewTicket] = useState(false);
  const [expand, setExpand] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const permission = getPermission('view:ticket');
      setCanViewTicket(permission?.isGranted || false);
    }
  }, [isAuthenticated, getPermission]);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const data = await fetch('/api/getcomplaint');
      const res = await data.json();
      const withStatus = res?.complaints?.map(c => ({ ...c, localStatus: "" })) || [];
      setComp(withStatus);
      setLoading(false);
    }
    if (isAuthenticated) fetcher();
  }, [isAuthenticated]);

  const collapse = (id) => {
    setExpanded(prev => (prev === id ? null : id));
  }

  const changeStatus = async (status, id) => {
    if (!status) return;
    await fetch('/api/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id, status })
    });
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
                    onClick={() => setExpand(prev => !prev)}
                    className="text-gray-700 hover:text-indigo-600 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {expand && (
                  <div className="md:hidden mt-8 ml-7 space-y-2 bg-white px-4 py-2 shadow rounded-lg absolute z-10">
                    <Link href="/StaffPage" className="block text-gray-700 hover:text-indigo-600">Dashboard</Link>
                    <Link href="/resolvedComplaints" className="block text-gray-700 hover:text-indigo-600">Resolved Complaints</Link>
                  </div>
                )}

                <div className="text-xl font-bold text-indigo-600">CIVIC_Pulse 🛡️</div>
                <div className="hidden md:flex space-x-8">
                  <Link href="/StaffPage" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                  <Link href="/resolvedComplaints" className="text-gray-700 hover:text-indigo-600">Resolved Complaints</Link>
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

          {/* Header */}
          <section className="flex flex-col items-center justify-center py-16 text-center gap-6">
            <h1 className="text-4xl md:text-5xl font-bold font-mono">
              👋 Welcome, <span className="text-indigo-500">{user?.given_name}</span> (Staff)
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Manage and resolve assigned complaints efficiently. Your work keeps the community running smoothly!
            </p>
          </section>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto px-6">
            <div className="bg-white shadow-md rounded-2xl p-6 text-center">
              <span className="text-3xl">📌</span>
              <h2 className="text-lg font-semibold mt-2">Assigned Complaints</h2>
              <p className="text-2xl font-bold text-indigo-600">{comp.length}</p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 text-center">
              <span className="text-3xl">⏳</span>
              <h2 className="text-lg font-semibold mt-2">Pending</h2>
              <p className="text-2xl font-bold text-amber-500">{comp.length}</p>
            </div>
          </div>

          {/* Complaints List */}
          <div className="md:grid md:grid-cols-2 gap-10 md:px-20 mt-10 grid grid-cols-1 px-10">
            {loading ? <Spinner /> : (
              comp.length === 0 ? (
                <p className="text-center font-mono">No complaints registered</p>
              ) : (
                comp.map(item => (
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition" key={item._id}>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{item.main}</h3>
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                          Category: {item.sub}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm">{item.description}</p>

                      {/* Image toggle */}
                      <button
                        className="flex items-center gap-2 text-green-600 font-medium text-sm"
                        onClick={() => collapse(item._id)}
                      >
                        {expanded === item._id ? "Hide Image" : "Show Image"}
                        {expanded === item._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {expanded === item._id && item.imgurl && (
                        <div className="w-full h-48 overflow-hidden transition-all duration-300">
                          <Image src={item.imgurl} alt={`Image for ${item.main}`} width={300}
                        height={300} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Status Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={item.localStatus}
                          onChange={(e) =>
                            setComp(prev => prev.map(c => c._id === item._id ? { ...c, localStatus: e.target.value } : c))
                          }
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Failed">Failed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      <div className='mt-5 text-center'>
                        {item.localStatus === 'Resolved' && <span className='text-lg font-bold font-mono text-green-400'>🟢Resolved</span>}
                        {item.localStatus === 'Pending' && <span className='text-lg font-bold font-mono text-red-500'>🔴Pending</span>}
                        {item.localStatus === 'Failed' && <span className='text-lg font-bold font-mono text-yellow-400'>🟡Failed</span>}
                      </div>

                      <div className='flex justify-center gap-3 mt-5'>
                        <button
                          onClick={() => changeStatus(item.localStatus, item._id)}
                          className='bg-blue-400 p-2 rounded-2xl text-center'
                        >
                          Update
                        </button>
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
        <div className='flex justify-center items-center flex-col gap-10'>
          <p className="text-center mt-20 text-xl font-mono text-red-500">You do not have the right permission</p>
          <Link href='/' className='bg-gray-700 text-white font-bold font-mono text-xl p-2 rounded-2xl hover:bg-gray-500 cursor-pointer'>
            Back to the Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default StaffPage;
