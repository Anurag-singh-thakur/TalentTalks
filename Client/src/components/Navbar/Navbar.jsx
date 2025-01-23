import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Loader from "../../Loader"
import Error from "../../Error"

export default function Navbar({ userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      fetchProfile(userId)
    } else {
      setLoading(false)
    }
  }, [userId])

  const fetchProfile = async (userId) => {
    if (!userId) {
      setError(new Error("User ID is required"))
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`http://localhost:5000/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setUserRole(response.data.role)
      console.log(response.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setUserRole(null)
  }

  const handleJoinRoom = () => {
    const roomCode = prompt("Enter Room Code or URL:")
    if (roomCode) {
      navigate(`/join-room/${roomCode}`)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Error />
      </div>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-extrabold text-white">
                Talent<span className="text-yellow-300">Talks</span>
              </span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            {userRole === "candidate" && (
              <button onClick={handleJoinRoom} className="nav-button bg-green-500 hover:bg-green-600">
                Join Room
              </button>
            )}
            {userRole === "recruiter" && (
              <NavLink to="/create-room" className="nav-button bg-blue-500 hover:bg-blue-600">
                Create Room
              </NavLink>
            )}
            {isAuthenticated ? (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <button onClick={handleLogout} className="nav-button bg-red-500 hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup" className="nav-button bg-yellow-500 hover:bg-yellow-600">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden bg-blue-600 bg-opacity-95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/">Home</MobileNavLink>
            {userRole === "candidate" && (
              <button onClick={handleJoinRoom} className="mobile-nav-button bg-green-500 hover:bg-green-600">
                Join Room
              </button>
            )}
            {userRole === "recruiter" && (
              <MobileNavLink to="/create-room" className="mobile-nav-button bg-blue-500 hover:bg-blue-600">
                Create Room
              </MobileNavLink>
            )}
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/profile">Profile</MobileNavLink>
                <button onClick={handleLogout} className="mobile-nav-button bg-red-500 hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login">Login</MobileNavLink>
                <MobileNavLink to="/signup" className="mobile-nav-button bg-yellow-500 hover:bg-yellow-600">
                  Sign Up
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </Link>
  )
}

