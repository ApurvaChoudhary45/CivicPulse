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
    const feedbackCollection = (await connection).db("Civic").collection("Feedback");

    await feedbackCollection.insertOne({
      ...body,
      userId: user.id,       // 🔑 attach userId
      createdAt: new Date(), // optional timestamp
    });

    return NextResponse.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Insert feedback failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
