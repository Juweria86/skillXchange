"use client"

import { Link } from "react-router-dom"
import { Upload, X } from "lucide-react"
import { useState } from "react"

export default function UploadPicturesPage() {
  const [pictures, setPictures] = useState([null, null, null])

  const handleRemovePicture = (index) => {
    const newPictures = [...pictures]
    newPictures[index] = null
    setPictures(newPictures)
  }

  return (
    <div className="min-h-screen bg-[#FFF7D4] flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#4a3630] text-white p-2 rounded-lg shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 10H3M16 2V6M8 2V6M10.5 14L8 16.5L10.5 19M13.5 14L16 16.5L13.5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">SkillSwap</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FBEAA0] rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-full bg-[#4a3630] text-white flex items-center justify-center font-bold">
              4
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-[#4a3630]">Upload your pictures</h1>
              <p className="text-gray-600 text-sm">Add photos to complete your profile.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (Required)</label>
              <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                {pictures[0] ? (
                  <>
                    <img
                      src={URL.createObjectURL(pictures[0]) || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => handleRemovePicture(0)}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Upload photo</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const newPictures = [...pictures]
                          newPictures[0] = e.target.files[0]
                          setPictures(newPictures)
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Photos (Optional)</label>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((index) => (
                  <div
                    key={index}
                    className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center"
                  >
                    {pictures[index] ? (
                      <>
                        <img
                          src={URL.createObjectURL(pictures[index]) || "/placeholder.svg"}
                          alt={`Additional ${index}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          onClick={() => handleRemovePicture(index)}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload photo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const newPictures = [...pictures]
                              newPictures[index] = e.target.files[0]
                              setPictures(newPictures)
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Photos should clearly show your face. Add photos of you doing activities related to your skills.
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              to="/personal-details-2"
              className="px-4 py-2 border border-[#4a3630] text-[#4a3630] rounded-lg hover:bg-white transition-colors"
            >
              Back
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pictures[0]
                  ? "bg-[#4a3630] text-white hover:bg-[#3a2a24]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Finish
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
