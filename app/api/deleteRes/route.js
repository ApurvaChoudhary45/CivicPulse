import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
let clientPromise = client.connect();
export async function DELETE(request) {

    try {
        
        const body = await request.json()
        const {_id} = body
        const pro =  (await clientPromise).db("Civic").collection('Pulse')
        await pro.deleteOne({id: _id})
        return NextResponse.json({ success: 'Deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: 'Was not able to delete' })
    }

}