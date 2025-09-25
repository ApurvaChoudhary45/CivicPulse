'use client'
import React from "react";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
const ComplaintForm = ({ onComplaintAdded }) => {
    const [complaint, setcomplaint] = useState(true)
    const [file, setfile] = useState(null)
    const [title, settitle] = useState('')
    const [Category, setCategory] = useState('')
    const [desc, setdesc] = useState('')
    const [url, seturl] = useState('')
    const [count, setcount] = useState(0)
    const { edgestore } = useEdgeStore();
    const isClose = () => {
        setcomplaint(false)
    }
    if (!complaint) return null

    const fileComplaint = async (e) => {
        e.preventDefault()
        let uplaodedURL = ''


        if (file) {
            const uploaded = await edgestore.publicFiles.upload({
                file
            })
            // console.log(upload)
            uplaodedURL = uploaded?.url
            seturl(uplaodedURL)
        }
        let obj = {
            main: title,
            sub: Category,
            description: desc,
            imgurl: uplaodedURL
        }
        const data = await fetch('/api/complaint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Specify JSON format
            },
            body: JSON.stringify(obj)
        })
        const res = await data.json();
        if (onComplaintAdded) {
            onComplaintAdded(res.complaint || obj);
        }


        setcomplaint(!complaint)

    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        📝 File a New Complaint
                    </h2>
                    <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={isClose}>✖</button>
                </div>

                {/* Form Fields */}
                <form className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complaint Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => settitle(e.target.value)}
                            placeholder="Enter a short title"
                            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" value={Category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">-- Select Category --</option>
                            <option value='Road'>Road</option>
                            <option value='Water'>Water</option>
                            <option value='Electricity'>Electricity</option>
                            <option value='Noise'>Noise</option>
                            <option value='Safety'>Safety</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe the issue..."
                            value={desc}
                            onChange={(e) => setdesc(e.target.value)}
                            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Attach Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attach Image (optional)
                        </label>
                        <input
                            type="file"
                            className="w-full border rounded-xl px-3 py-2 text-gray-600"
                            onChange={(e) => setfile(e.target.files[0])}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 text-white rounded-xl font-medium shadow hover:bg-green-600 transition"
                        onClick={fileComplaint}
                    >
                        🚀 Submit Complaint
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ComplaintForm;
