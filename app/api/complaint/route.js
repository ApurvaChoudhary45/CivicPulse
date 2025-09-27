


import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);
const connection = client.connect();

export async function POST(request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const tickdata = (await connection).db("Civic").collection("Pulse");

    await tickdata.insertOne({
      ...body,
      userId: user.id,      // 🔑 each complaint belongs to this user
      createdAt: new Date() // optional: timestamp
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("Insert failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
