// app/api/admin/backup-codes/route.ts
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { generateBackupCodes, hashSecret } from "@/lib/auth/twoFactor";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

/** Current backup codes ka status (kitne bache hain) */
export async function GET() {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();
    const user = await User.findById(session.user.id).select(
        "+backupCodes backupCodesGeneratedAt"
    );
    if (!user) return apiError("User not found", 404);

    return apiSuccess({
        remainingCodes: (user.backupCodes || []).length,
        generatedAt: user.backupCodesGeneratedAt || null,
    });
}

/** Naye 10 backup codes generate karo (purane invalidate ho jayenge) */
export async function POST() {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();

    const plainCodes = generateBackupCodes(10);
    const hashedCodes = await Promise.all(plainCodes.map((c) => hashSecret(c)));

    await User.updateOne(
        { _id: session.user.id },
        {
            $set: {
                backupCodes: hashedCodes,
                backupCodesGeneratedAt: new Date(),
            },
        }
    );

    return apiSuccess(
        { codes: plainCodes },
        {
            message:
                "Backup codes generate ho gaye. Inhe abhi save/download kar lein - ye sirf ek baar dikhenge.",
        }
    );
}