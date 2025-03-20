import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col items-center transform transition duration-500 hover:scale-105">
        {/* Image Section */}
        <div className="w-full h-40 overflow-hidden">
          <img
            src="https://source.unsplash.com/random/600x400"
            alt="illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="p-6 w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Create an Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center text-gray-500 my-4">OR</div>

          <p className="text-center text-gray-700">
            Have an account?{" "}
            <Link to="/AuthForm" className="text-blue-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
