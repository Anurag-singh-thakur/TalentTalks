import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar/Navbar"
import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Signup from "./components/SignUp/SignUp"
import Profile from "./components/Profile/Profile"
import Loader from "./Loader"
import Pattern from "./Pattern"
import { Toaster } from "react-hot-toast"
import { jwtDecode } from "jwt-decode"
import CreateRoom from "./components/createRoom/CreateRoom"
import JoinRoom from "./components/joinRoom/JoinRoom"

function App() {
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserId(decoded.id)
      } catch (err) {
        setError(new Error("Invalid token"))
      }
    } else {
      setError(new Error("User not authenticated"))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Loader />
      </div>
    )
  }

  return (
    <Router>
      <motion.div
        className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Toaster />
        <Pattern />
        <Navbar userId={userId} />
        <AnimatePresence mode="wait">
          <motion.div
            className="relative z-10 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/create-room" element={<CreateRoom />} />
              <Route path="/room/:roomId" element={<JoinRoom />} />
              <Route path="/profile" element={userId ? <Profile userId={userId} /> : <Navigate to="/login" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Router>
  )
}

export default App

