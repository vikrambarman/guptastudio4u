// scripts/test-connection.ts
import connectDB from "../lib/db/mongodb";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// .env.local load karo manually (script ke liye)
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function testConnection() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();

    console.log("✅ Connection Successful!");
    console.log("📊 Database Name:", mongoose.connection.db?.databaseName);
    console.log("🌐 Host:", mongoose.connection.host);

    // Collections list karo
    const collections = await mongoose.connection.db
      ?.listCollections()
      .toArray();
    console.log(
      "📁 Existing Collections:",
      collections?.map((c) => c.name) || "None yet (fresh database)"
    );

    await mongoose.connection.close();
    console.log("👋 Connection closed properly");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection Failed:", error);
    process.exit(1);
  }
}

testConnection();