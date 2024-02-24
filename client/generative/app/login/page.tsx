"use client"
import GoogleAuthButton from '@/components/GoogleAuthButton/page';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function login() { 

 const router = useRouter();

  return (
  
	<section className="flex flex-col md:flex-row h-screen items-center">
	<div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
	  <img
		src="https://source.unsplash.com/random/?network"
		alt=""
		className="w-full h-full object-cover"
	  />
	</div>

	<div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
	  <div className="w-full h-100">
		<h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
		  Log in to your account
		</h1>

		<form className="mt-6" action="#" method="POST">
		  <div>
			<label className="block text-gray-700">Email Address</label>
			<input
			  type="email"
			  name=""
			  id=""
			  placeholder="Enter Email Address"
			  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
			  autoFocus
			  autoComplete="required"
			/>
		  </div>

		  <div className="mt-4">
			<label className="block text-gray-700">Password</label>
			<input
			  type="password"
			  name=""
			  id=""
			  placeholder="Enter Password"
			  minLength="6"
			  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
			  required
			/>
		  </div>

		  <div className="text-right mt-2">
			<a
			  href="#"
			  className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
			>
			  Forgot Password?
			</a>
		  </div>

		  <button
			type="submit"
			className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
		  >
			Log In
		  </button>
		</form>

		<hr className="my-6 border-gray-300 w-full" />

           <GoogleAuthButton />
		<button
            className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
          >
            <div className="flex items-center justify-center">
              <div className="bg-white p-1 rounded-full">
			  <svg className="w-6" viewBox="0 0 32 32">
                    <path
                      fill-rule="evenodd"
                      d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                    />
                  </svg>
              </div>
              <span className="ml-4">Sign Up with GitHub</span>
            </div>
          </button>

		<p className="mt-8">
		  Need an account?{' '}
		  <button onClick={()=>router.push('/signup')}
			className="text-blue-500 hover:text-blue-700 font-semibold"
		  >
			Create an account
		  </button>
		</p>
	  </div>
	</div>
  </section>
   
  )
}
