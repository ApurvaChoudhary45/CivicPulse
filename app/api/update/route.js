


import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function PUT(request) {
    try {
        const body = await request.json()
        const {_id, status} = body
        const tickdata = (await connection).db('Civic').collection('Pulse')
        await tickdata.updateOne({_id : new ObjectId(_id)}, {$set : {status: status}})
        return NextResponse.json({ message: 'Success' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed' })
    }

}