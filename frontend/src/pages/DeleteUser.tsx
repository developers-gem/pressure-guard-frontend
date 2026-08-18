import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const DeleteUser = () => {
  const [email, setEmail] = useState("");

  const handleInput = (e) => {
    setEmail(e.target.value);
  };

  const notify = (message) => toast(message);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        notify("User Deleted!");
      } else {
        notify(data.msg || "Something Went Wrong!");
      }

      setEmail("");
    } catch (error) {
      console.error(error);
      notify("Unable to connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / App Name */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            PressureGuard Care
          </h1>

          <p className="mt-2 text-gray-500 text-sm">Manage your account</p>
        </div>

        {/* Delete Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Delete Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your registered email address to delete your account.
            </p>
          </div>

          <form onSubmit={handleFormSubmit}>
            {/* Email */}
            <div className="mb-6">
              {/* <label
                htmlFor="delete"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label> */}

              <input
                type="email"
                id="delete"
                name="email"
                value={email}
                onChange={handleInput}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           outline-none transition
                           focus:ring-2 focus:ring-red-500
                           focus:border-red-500
                           placeholder:text-gray-400"
              />
            </div>

            {/* Delete Button */}
            <button
              type="submit"
              className="w-full py-3 px-4
                         bg-red-600 hover:bg-red-700
                         text-white font-semibold
                         rounded-lg
                         transition duration-200
                         focus:outline-none
                         focus:ring-2 focus:ring-red-500
                         focus:ring-offset-2"
            >
              Delete Account
            </button>
          </form>
        </div>

        {/* Warning */}
        <p className="text-center text-xs text-gray-500 mt-5">
          ⚠️ This action is permanent and cannot be undone.
        </p>

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default DeleteUser;
