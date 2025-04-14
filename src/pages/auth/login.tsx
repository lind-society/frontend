// App.tsx
import React, { useState } from "react";

import { Navigate } from "react-router-dom";

import { authentication } from "../../hooks";

import { Background } from "../../components";

import { FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginFormData {
  identifier: string;
  password: string;
}

export const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authentication.login(formData.identifier, formData.password);
      window.location.href = "/admin/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const identifier = authentication.getUser();

  if (identifier) {
    return <Navigate to="/dashboard/main" />;
  }

  return (
    <Background src="/images/modern-villa-background.webp" alt="login background" className="flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-md p-8 rounded-lg shadow-lg bg-light">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="LIND Society" className="h-12 mb-4" />
          <h1 className="text-sm text-primary">Welcome to LIND Society</h1>
          <h2 className="text-xl font-medium text-center text-primary">
            Manage Your Villa & Property
            <br />
            with Ease
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="identifier" className="block mb-2 text-sm font-medium text-primary">
              Username or Email
            </label>
            <input type="text" id="identifier" name="identifier" value={formData.identifier} onChange={handleChange} className="input-text" placeholder="Enter your username or email" required />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-primary">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-text"
                placeholder="Enter your password"
                required
              />
              <button type="button" className="absolute -translate-y-1/2 primary text-dark right-3 top-1/2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
              </button>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <button type="submit" className="flex items-center justify-center w-full px-4 py-2 transition-colors duration-300 bg-teal-700 rounded-md text-light hover:bg-teal-800" disabled={isLoading}>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="loader size-6 after:size-6"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </Background>
  );
};
