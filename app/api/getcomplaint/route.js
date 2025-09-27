import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);
const connection = client.connect();

export async function GET(request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickdata = (await connection).db("Civic").collection("Pulse");
    const complaints = await tickdata.find({ userId: user.id }).toArray(); // filter by user
    return NextResponse.json({ message: "Success", complaints });
  } catch (error) {
    console.error("Fetch failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
