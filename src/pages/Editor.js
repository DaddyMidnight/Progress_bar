import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Camera, Upload, Download, RotateCcw, Settings, X } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import toast from 'react-hot-toast';

const Editor = () => {
  const [roomImage, setRoomImage] = useState(null);
  const [objectImage, setObjectImage] = useState(null);
  const [placedObjects, setPlacedObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const { canProcessImage, incrementUsage } = useSubscription();

  const onRoomDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRoomImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onObjectDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!canProcessImage()) {
        toast.error('You have reached your image processing limit. Please upgrade your plan.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setObjectImage(e.target.result);
        incrementUsage('images');
      };
      reader.readAsDataURL(file);
    }
  }, [canProcessImage, incrementUsage]);

  const { getRootProps: getRoomRootProps, getInputProps: getRoomInputProps, isDragActive: isRoomDragActive } = useDropzone({
    onDrop: onRoomDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const { getRootProps: getObjectRootProps, getInputProps: getObjectInputProps, isDragActive: isObjectDragActive } = useDropzone({
    onDrop: onObjectDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleCanvasClick = (e) => {
    if (!objectImage) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newObject = {
      id: Date.now(),
      image: objectImage,
      x: x,
      y: y,
      scale: 1,
      rotation: 0
    };

    setPlacedObjects([...placedObjects, newObject]);
    setObjectImage(null);
  };

  const handleObjectSelect = (object) => {
    setSelectedObject(object);
  };

  const handleObjectDelete = (objectId) => {
    setPlacedObjects(placedObjects.filter(obj => obj.id !== objectId));
    setSelectedObject(null);
  };

  const handleObjectTransform = (objectId, transform) => {
    setPlacedObjects(placedObjects.map(obj => 
      obj.id === objectId ? { ...obj, ...transform } : obj
    ));
  };

  const processObject = async () => {
    if (!objectImage) return;
    
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Object processed successfully! Click on the room to place it.');
    } catch (error) {
      toast.error('Failed to process object. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'virtual-room.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetCanvas = () => {
    setRoomImage(null);
    setObjectImage(null);
    setPlacedObjects([]);
    setSelectedObject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual Object Placer</h1>
          <p className="text-gray-600">Upload a room photo and place objects virtually</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Uploads */}
          <div className="space-y-6">
            {/* Room Upload */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Photo</h3>
              {!roomImage ? (
                <div
                  {...getRoomRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isRoomDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  <input {...getRoomInputProps()} />
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {isRoomDragActive ? 'Drop the room photo here' : 'Drag & drop a room photo, or click to select'}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img src={roomImage} alt="Room" className="w-full rounded-lg" />
                  <button
                    onClick={() => setRoomImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Object Upload */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Object to Place</h3>
              {!objectImage ? (
                <div
                  {...getObjectRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isObjectDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  <input {...getObjectInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {isObjectDragActive ? 'Drop the object photo here' : 'Drag & drop an object photo, or click to select'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <img src={objectImage} alt="Object" className="w-full rounded-lg" />
                  <button
                    onClick={processObject}
                    disabled={isProcessing}
                    className="w-full btn-primary"
                  >
                    {isProcessing ? 'Processing...' : 'Process Object'}
                  </button>
                  <button
                    onClick={() => setObjectImage(null)}
                    className="w-full btn-secondary"
                  >
                    Remove Object
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Room Editor</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={downloadResult}
                    disabled={!roomImage}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={resetCanvas}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                {roomImage ? (
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="w-full cursor-crosshair"
                    style={{ minHeight: '400px' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4" />
                      <p>Upload a room photo to get started</p>
                    </div>
                  </div>
                )}
              </div>

              {placedObjects.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Placed Objects</h4>
                  <div className="flex flex-wrap gap-2">
                    {placedObjects.map((obj) => (
                      <div
                        key={obj.id}
                        onClick={() => handleObjectSelect(obj)}
                        className={`w-16 h-16 rounded border-2 cursor-pointer ${
                          selectedObject?.id === obj.id ? 'border-primary-500' : 'border-gray-300'
                        }`}
                      >
                        <img src={obj.image} alt="Placed object" className="w-full h-full object-cover rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Object Properties Panel */}
        {selectedObject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded border border-gray-300">
                <img src={selectedObject.image} alt="Selected object" className="w-full h-full object-cover rounded" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Scale:</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={selectedObject.scale}
                    onChange={(e) => handleObjectTransform(selectedObject.id, { scale: parseFloat(e.target.value) })}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">{selectedObject.scale.toFixed(1)}x</span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Rotation:</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedObject.rotation}
                    onChange={(e) => handleObjectTransform(selectedObject.id, { rotation: parseInt(e.target.value) })}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">{selectedObject.rotation}°</span>
                </div>
              </div>
              <button
                onClick={() => handleObjectDelete(selectedObject.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Editor;