import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/api/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setBusy(true);
    try {
      const data = await forgotPassword(email.trim());
      setSent(true);
      toast.success(data.message || "Reset link sent if account exists.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Could not process request");
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
            <div className="font-display font-semibold tracking-tight">PressureGuard Care</div>
            <div className="text-xs text-muted-foreground">Staff password recovery</div>
          </div>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-medium">Instructions Sent</p>
                  <p className="text-muted-foreground">
                    If an active account matches <strong>{email}</strong>, a password reset link has been emailed.
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setSent(false)}
            >
              Send to another email
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Work Email</label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  required
                  autoFocus
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Enter the email associated with your staff account.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Sending reset link…" : "Send reset link"}
            </Button>
          </form>
        )}

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
