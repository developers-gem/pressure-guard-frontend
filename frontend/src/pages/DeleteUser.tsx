import { useState, type ChangeEvent, type FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)
interface DeleteUserResponse {
  success: boolean;
  msg?: string;
}

const DeleteUser = () => {
  const [email, setEmail] = useState<string>("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const notify = (message: string): void => {
    toast(message);
  };

  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data: DeleteUserResponse = await res.json();

      if (data.success) {
        notify("User Deleted!");
      } else {
        notify(data.msg || "Something Went Wrong!");
      }

      setEmail("");
    } catch (error: unknown) {
      console.error(error);
      notify("Unable to connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / App Name */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-600">
            PressureGuard Care
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your account
          </p>
        </div>

        {/* Delete Card */}
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Delete Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your registered email address to delete your account.
            </p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="mb-6">
              <input
                type="email"
                id="delete"
                name="email"
                value={email}
                onChange={handleInput}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3
                  outline-none transition placeholder:text-gray-400
                  focus:border-red-500 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-4 py-3
                font-semibold text-white transition duration-200
                hover:bg-red-700 focus:outline-none focus:ring-2
                focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account
            </button>
          </form>
        </div>

        {/* Warning */}
        <p className="mt-5 text-center text-xs text-gray-500">
          ⚠️ This action is permanent and cannot be undone.
        </p>

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default DeleteUser;