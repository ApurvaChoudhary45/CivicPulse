


import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function POST(request) {
    try {
        const body = await request.json()
        const tickdata = (await connection).db('Civic').collection('Resolved')
        await tickdata.insertOne(body)
        return NextResponse.json({ message: 'Success' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed' })
    }

}