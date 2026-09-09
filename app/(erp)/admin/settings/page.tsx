// app/(erp)/admin/settings/page.tsx
import { auth } from "@/auth";
import BackupCodesManager from "@/components/erp/admin/BackupCodesManager";

export default async function AdminSettingsPage() {
    const session = await auth();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-gold">Settings</h1>
                <p className="text-muted text-sm mt-1">
                    Account security aur preferences
                </p>
            </div>

            <div className="card mb-6" style={{ maxWidth: "600px" }}>
                <div className="section-label">Account Info</div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="text-muted text-sm">Name</span>
                        <span className="text-white text-sm">{session?.user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted text-sm">Email</span>
                        <span className="text-white text-sm">{session?.user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted text-sm">Role</span>
                        <span className="badge badge-gold">
                            {session?.user?.role?.replace("_", " ")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ maxWidth: "600px" }}>
                <div className="section-label">Two-Factor Authentication</div>
                <p className="text-sm text-muted mb-4">
                    Aapka account email OTP se protected hai. Agar kabhi email access na
                    ho, backup codes se login kar sakte hain.
                </p>
                <BackupCodesManager />
            </div>
        </div>
    );
}