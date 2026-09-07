// scripts/seed-admin.ts
import connectDB from "../lib/db/mongodb";
import User from "../lib/db/models/User";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function seedAdmin() {
    try {
        await connectDB();
        console.log("🔄 Connected to database...");

        const existingAdmin = await User.findOne({
            email: "guptastudio4u@gmail.com",
        });

        if (existingAdmin) {
            console.log("⚠️  Admin already exists! Skipping...");
            await mongoose.connection.close();
            process.exit(0);
        }

        const admin = await User.create({
            name: "Gupta Studio Admin",
            email: "guptastudio4u@gmail.com",
            password: "Admin@123", // CHANGE THIS after first login!
            role: "super_admin",
            phone: "6264192091",
            isActive: true,
        });

        console.log("✅ Admin Created Successfully!");
        console.log("📧 Email:", admin.email);
        console.log("🔑 Password: Admin@123 (CHANGE THIS IMMEDIATELY)");
        console.log("👤 Role:", admin.role);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Failed:", error);
        process.exit(1);
    }
}

seedAdmin();