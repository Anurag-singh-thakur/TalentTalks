import React , { useState } from "react"
import axios from "axios"
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom"
export default function Signup() {
    const navigate = useNavigate();
    const [formData , setFormData] = useState({
      name: "",
      email: "",
      password:"",
      role: "",

    })
    const handleChange = (e)=>{
      setFormData({...formData , [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
          const response = await axios.post("http://localhost:5000/auth/signup" , formData);
          console.log(response.data);
          toast.success("Signup Successful");
          navigate('/login')
          console.log(response.data.message);

      } catch (error) {
        toast.error(error.response?.data?.message || "Error occurred");
      }
    }
   
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-transparent border border-slate-500 rounded-lg p-8">
              <div>
                  <h2 className="mt-6 text-center text-3xl font-mono font-extrabold text-white">Create your account</h2>
              </div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6" action="#" method="POST">
                  <input type="hidden" name="remember" value="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                      <div>
                          <label htmlFor="name" className="sr-only">Full name</label>
                          <input
                              id="name"
                              name="name"
                              onChange={handleChange}
                              type="text"
                              autoComplete="name"
                              required
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-500 placeholder-gray-300 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out bg-white bg-opacity-20"
                              placeholder="Full name"
                          />
                      </div>
                      <div>
                          <label htmlFor="email-address" className="sr-only">Email address</label>
                          <input
                              id="email-address"
                              onChange={handleChange}
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 border-opacity-50 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out bg-white bg-opacity-20"
                              placeholder="Email address"
                          />
                      </div>
                      <div>
                          <label htmlFor="role" className="sr-only">Role</label>
                          <select
                              id="role"
                              name="role"
                              onChange={handleChange}
                              value={formData.role} // Set value to the state
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-200 border-opacity-50 bg-white bg-opacity-20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out text-white"
                          >
                              <option value="" disabled>Select your role</option>
                              <option value="candidate">Candidate</option>
                              <option value="recruiter">Recruiter</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="password" className="sr-only">Password</label>
                          <input
                              id="password"
                              name="password"
                              type="password"
                              onChange={handleChange}
                              autoComplete="new-password"
                              required
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 border-opacity -50 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out bg-white bg-opacity-20"
                              placeholder="Password"
                          />
                      </div>
                  </div>

               
                      <button
                          type="submit"
                          className="group relative w-full flex justify-center py-2 px-4 border border-white border-opacity-50 text-sm font-medium rounded-md text-white bg-white bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
                      >
                          Sign up
                      </button>
                 
              </form>
          </div>
      </div>
  );
}