import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { deleteUser } from "@/api/resources";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowLeft, Trash2 } from "lucide-react";

export default function DeleteUser() {
  const [email, setEmail] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setBusy(true);
    try {
      const data = await deleteUser(email.trim());
      if (data.success) {
        toast.success(data.msg || "User deleted successfully!");
        setEmail("");
      } else {
        toast.error(data.msg || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || error?.response?.data?.error || "Unable to connect to server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display font-semibold tracking-tight text-lg text-foreground">
              PressureGuard Care
            </h1>
            <p className="text-xs text-muted-foreground">Manage your account</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-foreground">Delete Account</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your registered staff email address to permanently remove your account.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                id="delete"
                name="email"
                value={email}
                onChange={handleInput}
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              variant="destructive"
              className="w-full"
              disabled={busy}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {busy ? "Deleting account…" : "Delete Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-amber-600 dark:text-amber-500">
            ⚠️ This action is permanent and cannot be undone.
          </p>

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
    </div>
  );
}
