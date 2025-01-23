"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const FeatureCard = ({ title, description, gradient, delay }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`p-6 rounded-lg shadow-lg bg-gradient-to-br ${gradient} bg-opacity-20 backdrop-filter backdrop-blur-sm transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.h2
        className="text-2xl font-semibold text-white mb-4"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {title}
      </motion.h2>
      <motion.p className="text-gray-100" animate={{ opacity: isHovered ? 1 : 0.8 }}>
        {description}
      </motion.p>
      <motion.div
        className="w-full h-1 bg-white mt-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default function Home() {
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black bg-opacity-30 rounded-xl shadow-2xl backdrop-filter backdrop-blur-lg">
        <motion.h1
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to TalentTalks
        </motion.h1>
        <motion.p
          className="text-xl text-gray-200 mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Streamline your candidate interviews with our powerful platform.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Efficient Scheduling",
              description: "Easily schedule and manage interviews with our intuitive calendar system.",
              gradient: "from-blue-400 to-blue-600",
              delay: 0.4,
            },
            {
              title: "Video Interviews",
              description: "Conduct seamless video interviews with high-quality audio and video.",
              gradient: "from-green-400 to-green-600",
              delay: 0.6,
            },
            {
              title: "Collaborative Evaluation",
              description: "Work together with your team to evaluate candidates effectively.",
              gradient: "from-yellow-400 to-yellow-600",
              delay: 0.8,
            },
          ].map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full text-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
          >
            Get Started
            <motion.span
              className="ml-2"
              animate={{ x: isButtonHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

