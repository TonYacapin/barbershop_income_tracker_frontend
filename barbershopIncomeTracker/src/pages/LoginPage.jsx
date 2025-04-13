"use client"

import { useState, useEffect } from "react"
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa"
import axiosInstance from "../api/axiosInstance"
import Cookies from "js-cookie"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Check if the token exists on component mount
    useEffect(() => {
        const token = Cookies.get("token")
        if (token) {
            // Redirect to the dashboard if the token exists
            window.location.href = "/Home"
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("") // Clear any previous errors
        setIsLoading(true)

        try {
            const response = await axiosInstance.post("/api/users/login", { email, password })
            const { token } = response.data

            // Save the token to cookies
            if (rememberMe) {
                Cookies.set("token", token, { expires: 7 }) // Token will expire in 7 days
            } else {
                Cookies.set("token", token) // Token will expire when the browser session ends
            }

            // Redirect to the dashboard or home page
            window.location.href = "/Home"
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#D72638]">
                        NGEL'S<span className="text-gray-800"> CUT</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your barbershop finances with ease</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 flex items-center">
                                <FaExclamationCircle className="mr-2 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 text-black pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                {/* <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </a>
                                </div> */}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#D72638] hover:bg-[#D72638]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D72638] transition-colors ${
                                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    <FaSignInAlt className="mr-2" />
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </a>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} FinanceTracker. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
