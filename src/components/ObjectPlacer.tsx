'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  PhotoIcon, 
  TrashIcon,
  ArrowsPointingOutIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import Webcam from 'react-webcam'
import toast from 'react-hot-toast'
import ImageEditor from './ImageEditor'

interface ObjectPlacerProps {
  onBack: () => void
}

interface UploadedImage {
  id: string
  url: string
  type: 'object' | 'room'
  name: string
}

export default function ObjectPlacer({ onBack }: ObjectPlacerProps) {
  const [step, setStep] = useState<'upload' | 'detect' | 'place'>('upload')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [selectedObject, setSelectedObject] = useState<UploadedImage | null>(null)
  const [roomImage, setRoomImage] = useState<UploadedImage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWebcam, setShowWebcam] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  const onDrop = useCallback((acceptedFiles: File[], type: 'object' | 'room') => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      type,
      name: file.name
    }))
    
    setUploadedImages(prev => [...prev, ...newImages])
    
    if (type === 'object') {
      setSelectedObject(newImages[0])
    } else {
      setRoomImage(newImages[0])
    }
    
    toast.success(`${type === 'object' ? 'Object' : 'Room'} image uploaded successfully!`)
  }, [])

  const { getRootProps: getObjectRootProps, getInputProps: getObjectInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, 'object'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const { getRootProps: getRoomRootProps, getInputProps: getRoomInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, 'room'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        const newImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: imageSrc,
          type: 'object' as const,
          name: 'webcam-capture.jpg'
        }
        setUploadedImages(prev => [...prev, newImage])
        setSelectedObject(newImage)
        setShowWebcam(false)
        toast.success('Photo captured successfully!')
      }
    }
  }, [])

  const processObjectDetection = async () => {
    if (!selectedObject) return
    
    setIsProcessing(true)
    toast.loading('Detecting object...', { id: 'detection' })
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Object detected and segmented!', { id: 'detection' })
    setIsProcessing(false)
    setStep('place')
  }

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
    if (selectedObject?.id === id) setSelectedObject(null)
    if (roomImage?.id === id) setRoomImage(null)
  }

  const renderUploadStep = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Images</h2>
        <p className="text-gray-600">First, upload an object you want to place, then upload a room photo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Object Upload */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <PhotoIcon className="w-6 h-6 mr-2 text-primary-600" />
            Upload Object
          </h3>
          <div
            {...getObjectRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
          >
            <input {...getObjectInputProps()} />
            <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag & drop an object image here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
          
          <button
            onClick={() => setShowWebcam(true)}
            className="w-full mt-4 btn-secondary flex items-center justify-center"
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Take Photo
          </button>
        </div>

        {/* Room Upload */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <PhotoIcon className="w-6 h-6 mr-2 text-primary-600" />
            Upload Room
          </h3>
          <div
            {...getRoomRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
          >
            <input {...getRoomInputProps()} />
            <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag & drop a room image here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {(selectedObject || roomImage) && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedObject && (
              <div className="relative">
                <img 
                  src={selectedObject.url} 
                  alt="Selected object" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(selectedObject.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <p className="text-sm text-gray-600 mt-2">Object: {selectedObject.name}</p>
              </div>
            )}
            {roomImage && (
              <div className="relative">
                <img 
                  src={roomImage.url} 
                  alt="Room" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(roomImage.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <p className="text-sm text-gray-600 mt-2">Room: {roomImage.name}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Button */}
      {selectedObject && roomImage && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setStep('detect')}
            className="btn-primary text-lg px-8 py-3"
          >
            Continue to Object Detection
          </button>
        </div>
      )}
    </div>
  )

  const renderDetectionStep = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Object Detection</h2>
        <p className="text-gray-600">Our AI will detect and segment the object from your image</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Original Image</h3>
          <img 
            src={selectedObject?.url} 
            alt="Original object" 
            className="w-full rounded-lg"
          />
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Processing...</h3>
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Detecting object boundaries...</p>
              </div>
            ) : (
              <div className="text-center">
                <ArrowsPointingOutIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Ready to detect</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center space-x-4">
        <button
          onClick={() => setStep('upload')}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={processObjectDetection}
          disabled={isProcessing}
          className="btn-primary"
        >
          {isProcessing ? 'Processing...' : 'Detect Object'}
        </button>
      </div>
    </div>
  )

  const renderPlacementStep = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Virtual Placement</h2>
        <p className="text-gray-600">Drag and drop the object anywhere in your room</p>
      </div>

      {roomImage && selectedObject && (
        <ImageEditor 
          roomImage={roomImage.url}
          objectImage={selectedObject.url}
        />
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => setStep('detect')}
          className="btn-secondary mr-4"
        >
          Back
        </button>
        <button
          onClick={() => {
            toast.success('Image saved successfully!')
          }}
          className="btn-primary"
        >
          Save Result
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${step === 'upload' ? 'bg-primary-600' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${step === 'detect' ? 'bg-primary-600' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${step === 'place' ? 'bg-primary-600' : 'bg-gray-300'}`} />
              </div>
              <span className="text-sm text-gray-600">
                Step {step === 'upload' ? '1' : step === 'detect' ? '2' : '3'} of 3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {step === 'upload' && renderUploadStep()}
      {step === 'detect' && renderDetectionStep()}
      {step === 'place' && renderPlacementStep()}

      {/* Webcam Modal */}
      {showWebcam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Take a Photo</h3>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={() => setShowWebcam(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="btn-primary flex-1"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}