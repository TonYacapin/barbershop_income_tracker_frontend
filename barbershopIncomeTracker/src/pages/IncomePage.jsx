import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa"
import axiosInstance from "../api/axiosInstance"

const IncomePage = () => {
  const [incomes, setIncomes] = useState([])
  const [formData, setFormData] = useState({
    source: "",
    numberOfHeads: "",
    isOwner: false,
  })
  const [message, setMessage] = useState({ text: "", type: "" })
  const [editingIncomeId, setEditingIncomeId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/api/income")
        setIncomes(response.data.incomes)
      } catch (error) {
        console.error("Error fetching income records:", error)
        setMessage({ text: "Failed to load income records", type: "error" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncomes()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ text: "", type: "" })

    try {
      if (editingIncomeId) {
        await axiosInstance.put(`/api/income/${editingIncomeId}`, formData)
        setMessage({ text: "Income record updated successfully!", type: "success" })
      } else {
        await axiosInstance.post("/api/income", formData)
        setMessage({ text: "Income record created successfully!", type: "success" })
      }

      const response = await axiosInstance.get("/api/income")
      setIncomes(response.data.incomes)
      setFormData({ source: "", numberOfHeads: "", isOwner: false })
      setEditingIncomeId(null)
    } catch (error) {
      console.error("Error saving income record:", error)
      setMessage({ text: "Failed to save income record. Please try again.", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return

    try {
      setIsLoading(true)
      await axiosInstance.delete(`/api/income/${id}`)
      setMessage({ text: "Income record deleted successfully!", type: "success" })
      const response = await axiosInstance.get("/api/income")
      setIncomes(response.data.incomes)
    } catch (error) {
      console.error("Error deleting income record:", error)
      setMessage({ text: "Failed to delete income record. Please try again.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (income) => {
    setFormData({
      source: income.source,
      numberOfHeads: income.numberOfHeads,
      isOwner: income.ownerShare === 0,
    })
    setEditingIncomeId(income._id)
    document.getElementById("income-form").scrollIntoView({ behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setFormData({ source: "", numberOfHeads: "", isOwner: false })
    setEditingIncomeId(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 text-[#191919]">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Income Management</h1>
        <p className="text-sm sm:text-base text-gray-600">Add, edit, and manage your income records</p>
      </div>

      <div id="income-form" className="bg-[#FFFFFF] rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          {editingIncomeId ? (
            <>
              <FaEdit className="mr-2 text-[#D72638]" />
              Edit Income Record
            </>
          ) : (
            <>
              <FaPlus className="mr-2 text-[#D72638]" />
              Add New Income
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-[#191919] mb-1">
                Source (Name of Barber)
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 text-[#191919] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638] transition-colors text-sm sm:text-base"
                placeholder="Enter barber name"
              />
            </div>

            <div>
              <label htmlFor="numberOfHeads" className="block text-sm font-medium text-[#191919] mb-1">
                Number of Heads
              </label>
              <input
                type="number"
                id="numberOfHeads"
                name="numberOfHeads"
                value={formData.numberOfHeads}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 text-[#191919] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D72638] focus:border-[#D72638] transition-colors text-sm sm:text-base"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isOwner"
                  checked={formData.isOwner}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors ${formData.isOwner ? "bg-[#D72638]" : "bg-gray-300"}`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isOwner ? "transform translate-x-6" : ""
                    }`}
                ></div>
              </div>
              <span className="ml-3 text-sm sm:text-base text-[#191919] font-medium">Is Owner</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-colors text-sm sm:text-base ${editingIncomeId ? "bg-[#D72638] hover:bg-red-700" : "bg-[#D72638] hover:bg-red-600"
                } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""} flex-grow sm:flex-grow-0`}
            >
              {isSubmitting ? "Processing..." : editingIncomeId ? "Update Record" : "Add Record"}
            </button>

            {editingIncomeId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg font-medium text-white bg-gray-200 hover:bg-gray-300 transition-colors text-sm sm:text-base flex-grow sm:flex-grow-0"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center text-sm sm:text-base ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
        >
          {message.type === "error" ? <FaTimes className="mr-2" /> : <FaCheck className="mr-2" />}
          {message.text}
        </div>
      )}

      {/* Income Records Table/Cards */}
      <div className="bg-[#FFFFFF] rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-[#191919]">Income Records</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#D72638] border-r-transparent"></div>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Loading records...</p>
          </div>
        ) : incomes.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm sm:text-base">
            <p>No income records found. Add your first record above.</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Source", "Heads", "Income", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#191919] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-xs font-medium text-[#191919] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incomes.map((income) => (
                    <tr key={income._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#191919]">{income.source}</td>
                      <td className="px-6 py-4 text-[#191919]">{income.numberOfHeads}</td>
                      <td className="px-6 py-4 text-[#D72638] font-bold">₱{income.income}</td>
                      <td className="px-6 py-4 text-[#191919]">{formatDate(income.createdAt)}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        <button onClick={() => handleEdit(income)} className="text-[#D72638] hover:text-[#b61e2e] mr-3">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(income._id)} className="text-[#D72638] hover:text-[#b61e2e]">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden">
              {incomes.map((income) => (
                <div key={income._id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-[#191919]">{income.source}</div>
                    <div className="text-[#D72638] font-bold">₱{income.income}</div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 mb-3">
                    <div>Heads: {income.numberOfHeads}</div>
                    <div>{formatDate(income.createdAt)}</div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button onClick={() => handleEdit(income)} className="text-[#D72638] hover:text-red-700 text-sm flex items-center">
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDelete(income._id)} className="text-red-600 hover:text-red-800 text-sm flex items-center">
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default IncomePage
