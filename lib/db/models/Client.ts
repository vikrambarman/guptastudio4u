// lib/db/models/Client.ts
import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IClientDocument extends Document {
    clientId: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    password: string;       // Hashed - login ke liye
    plainPassword: string;  // Pehli baar dikhane ke liye (encrypted, hashed nahi)
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    events: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const ClientSchema = new Schema<IClientDocument>(
    {
        clientId: {
            type: String,
            unique: true,
            // required nahi rakha - pre-save hook me generate hoga
        },
        name: {
            type: String,
            required: [true, "Client name is required"],
            trim: true,
            maxlength: 100,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [/^[0-9]{10}$/, "Enter valid 10-digit phone number"],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: "",
        },
        address: {
            type: String,
            trim: true,
            default: "",
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        plainPassword: {
            type: String,
            required: true,
            select: false, // Sirf admin request pe hi access hoga explicitly
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        events: [
            {
                type: Schema.Types.ObjectId,
                ref: "Event",
            },
        ],
    },
    { timestamps: true }
);

// ============================================================
// AUTO GENERATE Client ID: GS4U-2024-001
// ============================================================
ClientSchema.pre("save", async function (next) {
    if (this.isNew && !this.clientId) {
        const year = new Date().getFullYear();
        const ClientModel = mongoose.models.Client as Model<IClientDocument>;

        // Is saal ke last client ko dhundo
        const lastClient = await ClientModel.findOne({
            clientId: new RegExp(`^GS4U-${year}-`),
        }).sort({ createdAt: -1 });

        let nextNumber = 1;
        if (lastClient) {
            const lastNumber = parseInt(lastClient.clientId.split("-")[2], 10);
            nextNumber = lastNumber + 1;
        }

        this.clientId = `GS4U-${year}-${String(nextNumber).padStart(3, "0")}`;
    }
});

// Password hash karo

ClientSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

ClientSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

ClientSchema.index({ clientId: 1 });
ClientSchema.index({ phone: 1 });

const Client: Model<IClientDocument> =
    mongoose.models.Client ||
    mongoose.model<IClientDocument>("Client", ClientSchema);

export default Client;