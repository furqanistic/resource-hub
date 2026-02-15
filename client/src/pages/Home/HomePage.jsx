// File: client/src/pages/Home/HomePage.jsx
import React from 'react'
import Navbar from '@/components/Navbar'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CHOICE
          </h1>
          <p className="text-lg text-gray-600">
            Community Health Organization - Improving Care and Equity
          </p>
        </div>
      </main>
    </div>
  )
}

export default HomePage
