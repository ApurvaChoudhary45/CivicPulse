'use client'
import React, { useState, useEffect } from 'react'
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';
import { Heart } from "lucide-react";
import Link from 'next/link';

const CommunityUpdatesPage = () => {
  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const router = useRouter();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState({}); // { updateId: true/false }
  const [comments, setComments] = useState({}); // { updateId: 'comment text' }
  const [expand, setexpand] = useState(false)

  // redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/');
  }, [isLoading, isAuthenticated, router]);

  // fetch community updates
  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const res = await fetch('/api/community-update');
      const data = await res.json();
      setUpdates(data.updates || []);
      setLoading(false);
    }
    if (isAuthenticated) fetchUpdates();
  }, [isAuthenticated]);

  const handleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const handleCommentChange = (id, value) => {
    setComments(prev => ({ ...prev, [id]: value }));
  }

  const postComment = async (id) => {
    const comment = comments[id];
    if (!comment) return;

    await fetch('/api/community-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updateId: id, comment })
    });

    // clear comment input
    setComments(prev => ({ ...prev, [id]: '' }));
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
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
                <Link href="/UserPage" className="block text-gray-700 hover:text-indigo-600">Dashboard</Link>
                <Link href="/UserPage" className="block text-gray-700 hover:text-indigo-600">File Complaints</Link>
                <Link href="/userResolved" className="block text-gray-700 hover:text-indigo-600">Resolved Complaint</Link>
                <Link href="/communityUpdate" className="block text-gray-700 hover:text-indigo-600">Community Updates</Link>
              </div>
            )}
            <div className="text-xl font-bold text-indigo-600">CIVIC_Pulse 🛡️</div>
            <div className="hidden md:flex space-x-8">
              <Link href="/UserPage" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link href="/UserPage" className="text-gray-700 hover:text-indigo-600">
                File Complaints
              </Link>
              <Link href="/userResolved" className="text-gray-700 hover:text-indigo-600">
                Resolved Complaint
              </Link>
              <Link href="/communityUpdate" className="text-gray-700 hover:text-indigo-600">
                Community Updates
              </Link>
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
      <header className="text-center mt-12 mb-6">
        <h1 className="text-4xl font-bold text-indigo-600">🌱 Community Updates</h1>
        <p className="text-gray-600 mt-2">See what’s happening in your neighborhood</p>
      </header>

      {/* Updates List */}
      <main className="max-w-6xl mx-auto px-4">
        {loading ? <Spinner /> : (
          updates.length === 0 ? (
            <p className="text-center font-mono mt-10">No community updates yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {updates.map(update => (
                <div key={update._id} className="bg-white shadow-md rounded-xl p-5 flex flex-col gap-4">
                  {/* Title & Description */}
                  <h2 className="text-xl font-semibold text-gray-800">{update.title}</h2>
                  <p className="text-gray-600">{update.description}</p>
                  {update.imgurl && (
                    <img src={update.imgurl} alt="update" className="w-full h-48 object-cover rounded-lg" />
                  )}

                </div>
              ))}
            </div>
          )
        )}
      </main>

      <footer className="w-full text-center text-lg text-white py-8 bg-indigo-600 mt-20">
        © 2025 Civic_Pulse. All rights reserved.
      </footer>
    </div>
  );
}

export default CommunityUpdatesPage;
