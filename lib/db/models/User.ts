// lib/db/models/User.ts
import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "super_admin" | "admin" | "staff";

export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    isActive: boolean;
    // ── 2FA Fields (naye) ──
    twoFactorOtpHash?: string;
    twoFactorOtpExpires?: Date;
    passwordResetOtpHash?: string;
    passwordResetOtpExpires?: Date;
    backupCodes?: string[];
    backupCodesGeneratedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["super_admin", "admin", "staff"],
            default: "staff",
        },
        phone: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // ── 2FA Fields (naye) ──
        twoFactorOtpHash: { type: String, select: false },
        twoFactorOtpExpires: { type: Date, select: false },
        passwordResetOtpHash: { type: String, select: false },
        passwordResetOtpExpires: { type: Date, select: false },
        backupCodes: { type: [String], select: false, default: [] },
        backupCodesGeneratedAt: { type: Date },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ email: 1 });

const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;