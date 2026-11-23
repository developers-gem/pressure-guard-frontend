import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Missing reset token. Request a new reset link.");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setBusy(true);
        try {
            const { data } = await api.post("/auth/reset-password", { token, password });
            toast.success(data.message || "Password updated");
            navigate("/login");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to reset password");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="font-display font-semibold tracking-tight">Reset Password</div>
                        <div className="text-xs text-muted-foreground">Choose a new password (min 8 chars)</div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">New Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Confirm Password</label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? "Updating…" : "Update password"}
                    </Button>
                </form>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
                </p>
            </div>
        </div>
    );
}