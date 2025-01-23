import React, { useState, useEffect } from "react"
import axios from "axios"
import { FaUser, FaTrash, FaKey, FaEnvelope, FaUserTag } from "react-icons/fa"
import Loader from "../../Loader"


function SquareProfile({ userId }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError(new Error("User ID is required"))
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`)
        setProfile(response.data)
        console.log( response.data) ;
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleEdit = () => {
    console.log("Edit profile")
  }

  const handleDelete = () => {
    console.log("Delete profile")
  }

  const handleChangePassword = () => {
    console.log("Change password")
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    )

  if (error)
    return <div className="text-red-500 text-center mt-4 p-4 rounded-lg">Error: {error.message}</div>

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent p-4">
      <div className="w-full max-w-2xl aspect-square rounded-xl shadow-2xl overflow-hidden border  border-slate-500 ">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-6 flex items-center justify-center ">
            <img
              src={profile.photoUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <div className="flex-grow p-6 flex flex-col justify-between">
            <div>
              <div className="uppercase  font-mono font-bold tracking-wide text-2xl text-Black  mb-1">User Profile</div>
              <h1 className="text-3xl font-bold text-white  mb-4">{profile.name}</h1>
              <div className="grid grid-cols-1 gap-4 text-white">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-indigo-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center">
                  <FaUserTag className="mr-2 text-indigo-500" />
                  <span>{profile.role}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleEdit}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FaUser className="mr-2" /> Edit
              </button>
              <button
                onClick={handleChangePassword}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FaKey className="mr-2" /> Password
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SquareProfile

