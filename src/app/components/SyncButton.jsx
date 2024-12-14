'use client'
import React from 'react'

const SyncButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
      Sync Data
    </button>
  )
}

export default SyncButton 