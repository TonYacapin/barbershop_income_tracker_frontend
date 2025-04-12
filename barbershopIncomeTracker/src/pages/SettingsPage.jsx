"use client"

import { useState, useEffect } from "react"
import { FaSave, FaCog, FaCheck, FaTimes } from "react-icons/fa"
import axiosInstance from "../api/axiosInstance"

const SettingsPage = () => {
  const [haircutPrice, setHaircutPrice] = useState("")
  const [ownerSharePercentage, setOwnerSharePercentage] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch existing income settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/api/income-settings")

        // Access the nested settings object
        const { haircutPrice, ownerSharePercentage } = response.data.settings

        // Populate input fields with existing settings
        setHaircutPrice(haircutPrice ?? "")
        setOwnerSharePercentage(ownerSharePercentage ?? "")
      } catch (error) {
        console.error("Error fetching income settings:", error)
        setMessage({
          text: "Failed to load settings. Please try again.",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Handle form submission to update settings
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: "", type: "" }) // Clear any previous messages
    setIsSubmitting(true)

    try {
      await axiosInstance.post("/api/income-settings", {
        haircutPrice,
        ownerSharePercentage,
      })
      setMessage({
        text: "Settings updated successfully!",
        type: "success",
      })
    } catch (error) {
      console.error("Error updating income settings:", error)
      setMessage({
        text: "Failed to update settings. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <FaCog className="mr-3 text-gray-700" />
          Settings
        </h1>
        <p className="text-gray-600">Configure your income calculation parameters</p>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading settings...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Income Parameters</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="haircutPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Haircut Price ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₱</span>
                    </div>
                    <input
                      type="number"
                      id="haircutPrice"
                      value={haircutPrice || ""}
                      onChange={(e) => setHaircutPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">The standard price charged for each haircut</p>
                </div>

                <div>
                  <label htmlFor="ownerSharePercentage" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Share Percentage (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="ownerSharePercentage"
                      value={ownerSharePercentage || ""}
                      onChange={(e) => setOwnerSharePercentage(e.target.value)}
                      required
                      min="0"
                      max="100"
                      className="w-full pr-10 pl-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Percentage of income that goes to the owner</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-5 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center ${
            message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message.type === "error" ? <FaTimes className="mr-2" /> : <FaCheck className="mr-2" />}
          {message.text}
        </div>
      )}

      {/* Settings Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">How Settings Work</h2>
        <div className="space-y-4 text-gray-700">
          <p>These settings determine how income is calculated for each barber:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Haircut Price</h3>
            <p className="text-sm">
              This is the standard price charged for each haircut. It's used to calculate the total income based on the
              number of heads.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Owner Share Percentage</h3>
            <p className="text-sm">
              This percentage determines how much of each barber's income goes to the owner. For example, if set to 30%,
              then 30% of each barber's income will be allocated to the owner.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
