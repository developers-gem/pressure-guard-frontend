import { useState } from "react";
import { Link } from "react-router-dom";
// import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        try {
            const { data } = await api.post("/auth/forgot-password", { email });
            setSent(true);
            toast.success(data.message || "Reset link sent if account exists.");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Could not process request");
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
                        <div className="font-display font-semibold tracking-tight">Forgot Password</div>
                        <div className="text-xs text-muted-foreground">We'll email you a reset link</div>
                    </div>
                </div>

                {sent ? (
                    <p className="text-sm text-muted-foreground">
                        If an active staff account matches <strong>{email}</strong>, a password reset link has been sent.
                        Check your inbox and spam folder.
                    </p>
                ) : (
                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={busy}>
                            {busy ? "Sending link…" : "Send reset link"}
                        </Button>
                    </form>
                )}

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
                </p>
            </div>
        </div>
    );
}