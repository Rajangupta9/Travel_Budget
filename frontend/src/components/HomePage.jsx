import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* Import Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

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

      {/* Header/Navigation */}
      <header className="relative z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.589 2 4 5.589 4 10c0 1.806.602 3.485 1.61 4.815L12 22l6.39-7.185A7.921 7.921 0 0020 10c0-4.411-3.589-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
              <span className="ml-2 text-2xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-violet-600" style={{ 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>TravelBudget</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/auth" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Log in
              </Link>
              <Link to="/auth" state={{ signup: true }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="block text-gray-900">Travel Smart,</span>
            <span className="block text-gradient bg-gradient-to-r from-indigo-600 to-violet-600" style={{ 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Budget Better</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-700">
            Plan your travels with confidence. Track expenses, set budgets, and enjoy your journey without financial surprises.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                to="/auth"
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md transform transition-all duration-150 hover:scale-105"
              >
                Start Your Journey
              </Link>
              <a
                href="#features"
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transform transition-all duration-150 hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Plan Your Perfect Trip
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to make your travel dreams a reality while staying on budget.
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="p-6">
                <div className="rounded-md bg-indigo-100 p-3 inline-block">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Budget Tracking</h3>
                <p className="mt-2 text-base text-gray-500">
                  Set travel budgets and track your expenses in real-time to stay on target.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="p-6">
                <div className="rounded-md bg-indigo-100 p-3 inline-block">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Currency Conversion</h3>
                <p className="mt-2 text-base text-gray-500">
                  Automatic currency conversion to help you understand your spending anywhere in the world.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="p-6">
                <div className="rounded-md bg-indigo-100 p-3 inline-block">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Trip Planning</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create detailed itineraries and estimate costs before you even leave home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative z-10 bg-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg className="h-12 w-12 mx-auto text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="mt-4 text-xl leading-8 text-white font-medium">
              "TravelBudget completely changed how I plan my trips. I've saved over $500 on my last vacation by staying on budget and making smarter choices."
            </p>
            <div className="mt-6">
              <p className="text-base font-medium text-indigo-100">Sarah Johnson</p>
              <p className="text-base text-indigo-300">Frequent Traveler</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Ready to start your adventure?
                </h2>
                <p className="mt-4 text-lg text-indigo-100">
                  Sign up today and get access to all premium features free for 30 days.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="space-y-4 sm:space-x-4 sm:space-y-0 sm:flex">
                  <Link
                    to="/auth"
                    state={{ signup: true }}
                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-md transform transition-all duration-150 hover:scale-105"
                  >
                    Sign up for free
                  </Link>
                  <Link
                    to="/auth"
                    className="flex items-center justify-center px-6 py-3 border border-white border-opacity-60 text-base font-medium rounded-md text-white hover:bg-indigo-500 transform transition-all duration-150 hover:scale-105"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C7.589 2 4 5.589 4 10c0 1.806.602 3.485 1.61 4.815L12 22l6.39-7.185A7.921 7.921 0 0020 10c0-4.411-3.589-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
                <span className="ml-2 text-2xl font-bold text-white">TravelBudget</span>
              </div>
              <p className="mt-4 text-gray-400">
                Making travel planning easier and more affordable for everyone.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">About</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">Careers</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">Privacy</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">Terms</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2025 TravelBudget. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;