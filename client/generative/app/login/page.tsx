"use client"
import GoogleAuthButton from '@/components/GoogleAuthButton/page';
import Loaders from '@/components/Loaders/page';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function login() {

	const [errorMessage, setErrorMessage] = useState(null);


	const router = useRouter();

	const { status, data: session } = useSession();


	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/home');
		}
	}, [session, status, router]);

	// if the googleLogin user has workspace
	useEffect(() => {
		const checkWorkspace = async () => {
		  if (session?.user) {
			try {
			  const userInfo = await axios.post('http://localhost:8000/checkHaveWorkspace', {
				email: session.user.email,
			  });
			  if(userInfo.data.token){
				const token = userInfo.data.token

				document.cookie = `token=${token}; path=/;`;
			  }
			  if (userInfo.data.hasWorkspace) {
				router.push(`/home/${userInfo.data.workspaceId}`);
			  } else {
				router.push('/new_workspace');
			  }
			} catch (error) {
			  console.error('Error checking workspace:', error.message);
			}
		  }
		};
	
		checkWorkspace();
	  }, [session, router]);


	const handleLogin = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			const response = await axios.post('http://localhost:8000/login', {
				email: email,
				password: password,
			});


			console.log(response);

			if (response.data.success) {

				const token = response.data.token;

				document.cookie = `token=${token}; path=/;`;
				console.log(token);

				if (response.data.redirectUrl) {
					router.push(response.data.redirectUrl);
				} else {
					router.push('/new_workspace');
				}


			} else {
				console.error('Login failed:', response.data.message);
				setErrorMessage(`Login failed: ${response.data.message}`);
				setTimeout(() => {
					setErrorMessage(null);
				}, 3000);
			}
		} catch (error) {
			console.error('Login failed:', error.message);

			if (error.response) {
				if (error.response.status === 401) {
					setErrorMessage('Invalid email or password.');
				} else {
					setErrorMessage('Login failed. invaild User Credentials, Please try again later.');
				}
			} else if (error.request) {
				setErrorMessage('No response from the server. Please try again later.');
			} else {
				setErrorMessage('An error occurred. Please try again later.');
			}
			setTimeout(() => {
				setErrorMessage(null);
			}, 3000);
		}
	};

	if (status === "loading") {
		return <Loaders />;
	  }

	return (

		<section className="flex flex-col md:flex-row h-screen items-center">
			<div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
				<img
					src="https://source.unsplash.com/random/?network"
					alt=""
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="bg-white  dark:bg-gray-800 w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
				<div className="w-full h-100">
					<h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
						Log in to your account
					</h1>
					{errorMessage && (
						<div className="text-red-500 mt-4">
							{errorMessage}
						</div>
					)}

					<form onSubmit={handleLogin} className="mt-6" method="POST">
						<div>
							<label className="block dark:text-white text-gray-700">Email Address</label>
							<input
								type="email"
								name="email"
								placeholder="Enter Email Address"
								className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none dark:text-black"
								autoFocus
								autoComplete="required"
							/>
						</div>

						<div className="mt-4">
							<label className="block text-gray-700 dark:text-white">Password</label>
							<input
								type="password"
								name="password"
								placeholder="Enter Password"
								minLength="6"
								className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none dark:text-black"
								required
							/>
						</div>

						<div className="text-right mt-2">
							<a
								href="#"
								className="text-sm font-semibold dark:text-white text-gray-700 hover:text-blue-700 focus:text-blue-700"
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
					

					<p className="mt-8">
						Need an account?{' '}
						<button onClick={() => router.push('/signup')}
							className="text-blue-500 hover:text-blue-700 font-semibold"
						>
							Create an account
						</button>
					</p>
				</div>
			</div>
			<ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
		</section>

	)
}
