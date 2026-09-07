// scripts/seed-test-client.ts
import connectDB from "../lib/db/mongodb";
import Client from "../lib/db/models/Client";
import User from "../lib/db/models/User";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function seedTestClient() {
  try {
    await connectDB();

    const admin = await User.findOne({ email: "guptastudio4u@gmail.com" });
    if (!admin) {
      console.log("❌ Admin not found. Run db:seed-admin first!");
      process.exit(1);
    }

    const existingClient = await Client.findOne({ phone: "9876543210" });
    if (existingClient) {
      console.log("⚠️ Test client already exists!");
      console.log("Client ID:", existingClient.clientId);
      process.exit(0);
    }

    const testPassword = "Test@123";

    const client = await Client.create({
      name: "Test Client (Sharma Ji)",
      phone: "9876543210",
      email: "testclient@example.com",
      address: "Test Address, City",
      password: testPassword,
      plainPassword: testPassword,
      createdBy: admin._id,
    });

    console.log("✅ Test Client Created!");
    console.log("🆔 Client ID:", client.clientId);
    console.log("🔑 Password:", testPassword);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTestClient();