import React, { useState } from 'react';
// import { loginUser } from '../controllers/authController';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (isLogin) {
      console.log('Login submitted:', { email: formData.email, password: formData.password });
    } else {
      console.log('Signup submitted:', formData);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Import Google Fonts */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
          }
        `
      }} />

      {/* Background with traveling cartoon elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-cyan-100"></div>
        
        {/* Sun */}
        <div className="absolute top-8 right-16 w-24 h-24 rounded-full bg-yellow-300 animate-pulse"></div>
        
        {/* Clouds */}
        <div className="absolute top-12 left-1/4 w-32 h-12 bg-white rounded-full animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-24 left-1/2 w-48 h-16 bg-white rounded-full animate-bounce" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-16 right-1/4 w-40 h-14 bg-white rounded-full animate-bounce" style={{ animationDuration: '9s' }}></div>
        
        {/* Mountains in the background */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-green-800 to-green-600" style={{ clipPath: 'polygon(0% 100%, 10% 80%, 20% 90%, 30% 70%, 40% 85%, 50% 60%, 60% 75%, 70% 65%, 80% 80%, 90% 70%, 100% 100%)' }}></div>
        
        {/* Airplane */}
        <div className="absolute top-32 -left-20 animate-moving-airplane">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.9L17.54 19.22L14.37 21.75C13.8 22.29 13.33 22 13 21.5V17.62L8.41 18.21L6.38 20.3C6.23 20.47 6 20.5 5.71 20.3L4.4 18.45C4.14 18.18 4.27 17.91 4.5 17.74L7.13 15.77L7.86 13L3.72 13.26L2.11 14.27C1.94 14.39 1.5 14.5 1.13 14.35L0 12.97C0 12.97 0.17 12.67 0.3 12.58L1.82 11.64L5.26 10.28C5.28 10.28 10.38 7.67 12.62 6.56C12.62 6.56 13.38 6.13 13.79 6.14C14.47 6.16 15.15 6.7 15.15 6.7C15.15 6.7 15.21 6.8 15.38 7.1L21.67 10.88L23 11.31C23.32 11.42 23.89 11.9 23.77 12.46L23.09 13.37C22.97 13.83 22.5 14 22 14H18.5L17.79 16.05L22 16.9Z" fill="#4299e1"/>
          </svg>
        </div>
        
        {/* Hot air balloon */}
        <div className="absolute top-40 right-24 animate-float" style={{ animationDuration: '15s' }}>
          <div className="w-16 h-20 bg-gradient-to-b from-red-500 to-pink-500 rounded-t-full"></div>
          <div className="w-8 h-6 bg-yellow-700 mx-auto rounded-b-lg"></div>
          <div className="w-0.5 h-4 bg-gray-800 mx-auto"></div>
        </div>
        
        {/* Palm trees */}
        <div className="absolute bottom-0 left-1/4">
          <div className="w-4 h-16 bg-yellow-800 mx-auto"></div>
          <div className="w-24 h-16 bg-green-600 rounded-full -mt-8 -ml-10"></div>
        </div>
        
        <div className="absolute bottom-0 right-1/4">
          <div className="w-4 h-20 bg-yellow-800 mx-auto"></div>
          <div className="w-24 h-16 bg-green-600 rounded-full -mt-8 -ml-10"></div>
        </div>
        
        {/* Moving car */}
        <div className="absolute bottom-12 -left-20 animate-moving-car">
          <div className="w-20 h-6 bg-red-600 rounded-t-lg"></div>
          <div className="w-24 h-4 bg-red-500 rounded-md"></div>
          <div className="w-6 h-3 bg-black rounded-full absolute -bottom-2 left-2"></div>
          <div className="w-6 h-3 bg-black rounded-full absolute -bottom-2 right-2"></div>
        </div>
      </div>

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes moveAirplane {
            0% { transform: translateX(-100px); }
            100% { transform: translateX(calc(100vw + 100px)); }
          }
          
          @keyframes moveCar {
            0% { transform: translateX(-100px); }
            100% { transform: translateX(calc(100vw + 100px)); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-moving-airplane {
            animation: moveAirplane 20s linear infinite;
          }
          
          .animate-moving-car {
            animation: moveCar 15s linear infinite;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `
      }} />

      {/* Form Card */}
      <div className="max-w-md w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all ">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 py-6 px-6">
          <h2 className="text-center text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Traveler!' : 'Join Our Adventures'}
          </h2>
          <p className="text-center text-indigo-100 mt-2">
            {isLogin ? 'Sign in to continue your journey' : 'Sign up to start exploring'}
          </p>
        </div>

        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {isLogin && (
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transform transition-all duration-150 hover:scale-105"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLogin ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {isLogin ? 'Continue Your Journey' : 'Start Your Adventure'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <a
                href="#"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-150 transform hover:scale-105"
              >
                {/* Google Icon */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
                    fill="#4285F4" />
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
                    fill="#34A853" clipPath="url(#clip0)" transform="translate(0 6)" />
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
                    fill="#FBBC05" clipPath="url(#clip1)" transform="translate(0 3)" />
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
                    fill="#EA4335" clipPath="url(#clip2)" transform="translate(0 9)" />
                  <defs>
                    <clipPath id="clip0">
                      <rect width="24" height="6" fill="white"/>
                    </clipPath>
                    <clipPath id="clip1">
                      <rect width="24" height="6" fill="white"/>
                    </clipPath>
                    <clipPath id="clip2">
                      <rect width="24" height="6" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Continue with Google
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleForm}
                className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;