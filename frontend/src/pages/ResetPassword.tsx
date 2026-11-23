import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "@/api/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
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
      const data = await resetPassword({
        token,
        password,
      });
      toast.success(data.message || "Password updated successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Failed to reset password");
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Invalid Reset Link</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            No reset token was found in the link. Please request a new password reset email.
          </p>
          <div className="mt-6 space-y-2">
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request New Reset Link</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full text-xs">
              <Link to="/login">Back to Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display font-semibold tracking-tight">PressureGuard Care</div>
            <div className="text-xs text-muted-foreground">Set new staff password</div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Updating password…" : "Update password"}
          </Button>
        </form>

        <div className="mt-6 border-t pt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
