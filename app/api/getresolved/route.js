


import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function GET(request) {
    try {
        
        const tickdata = (await connection).db('Civic').collection('Feedback')
        const complaints = await tickdata.find({}).toArray()
        return NextResponse.json({ message: 'Success' , complaints})
    } catch (error) {
        return NextResponse.json({ error: 'Failed' })
    }

}