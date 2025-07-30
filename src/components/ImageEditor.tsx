'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon,
  ArrowPathIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface ImageEditorProps {
  roomImage: string
  objectImage: string
}

export default function ImageEditor({ roomImage, objectImage }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [isObjectVisible, setIsObjectVisible] = useState(true)
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8fafc'
    })

    fabricCanvasRef.current = canvas

    // Load room image as background
    fabric.Image.fromURL(roomImage, (img) => {
      img.scaleToWidth(800)
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
    })

    // Load object image
    fabric.Image.fromURL(objectImage, (obj) => {
      obj.scaleToWidth(200)
      obj.set({
        left: 100,
        top: 100,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        cornerColor: '#3b82f6',
        cornerSize: 10,
        transparentCorners: false,
        borderColor: '#3b82f6',
        borderScaleFactor: 2
      })

      canvas.add(obj)
      canvas.setActiveObject(obj)
      setSelectedObject(obj)

      // Handle object selection
      obj.on('selected', () => {
        setSelectedObject(obj)
      })

      obj.on('deselected', () => {
        setSelectedObject(null)
      })

      canvas.renderAll()
    })

    return () => {
      canvas.dispose()
    }
  }, [roomImage, objectImage])

  const handleZoomIn = () => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current
      const zoom = canvas.getZoom()
      canvas.setZoom(Math.min(zoom * 1.1, 3))
      canvas.renderAll()
    }
  }

  const handleZoomOut = () => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current
      const zoom = canvas.getZoom()
      canvas.setZoom(Math.max(zoom / 1.1, 0.1))
      canvas.renderAll()
    }
  }

  const handleResetZoom = () => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current
      canvas.setZoom(1)
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      canvas.renderAll()
    }
  }

  const handleDeleteObject = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.remove(selectedObject)
      setSelectedObject(null)
      fabricCanvasRef.current.renderAll()
    }
  }

  const handleToggleObjectVisibility = () => {
    if (selectedObject) {
      selectedObject.set('visible', !isObjectVisible)
      setIsObjectVisible(!isObjectVisible)
      fabricCanvasRef.current?.renderAll()
    }
  }

  const handleBringToFront = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.bringToFront(selectedObject)
      fabricCanvasRef.current.renderAll()
    }
  }

  const handleSendToBack = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.sendToBack(selectedObject)
      fabricCanvasRef.current.renderAll()
    }
  }

  const handleDuplicate = () => {
    if (fabricCanvasRef.current && selectedObject) {
      selectedObject.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (selectedObject.left || 0) + 20,
          top: (selectedObject.top || 0) + 20
        })
        fabricCanvasRef.current?.add(cloned)
        fabricCanvasRef.current?.setActiveObject(cloned)
        setSelectedObject(cloned)
        fabricCanvasRef.current?.renderAll()
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ArrowsPointingInIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Drag the object to move it, use corners to resize
        </div>

        {selectedObject && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleObjectVisibility}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={isObjectVisible ? "Hide Object" : "Show Object"}
            >
              {isObjectVisible ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleBringToFront}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Bring to Front"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={handleSendToBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Send to Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={handleDuplicate}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Duplicate"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteObject}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Object"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Canvas Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <canvas
          ref={canvasRef}
          className="block mx-auto"
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click and drag the object to move it around the room</li>
          <li>• Use the corner handles to resize the object</li>
          <li>• Use the rotation handle to rotate the object</li>
          <li>• Use the toolbar buttons to zoom, duplicate, or delete objects</li>
        </ul>
      </div>
    </div>
  )
}