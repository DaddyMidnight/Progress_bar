'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CameraIcon, SparklesIcon, CloudArrowUpIcon, EyeIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ObjectPlacer from '@/components/ObjectPlacer'

export default function Home() {
  const [showDemo, setShowDemo] = useState(false)

  const features = [
    {
      icon: CameraIcon,
      title: 'Capture Objects',
      description: 'Take photos of any object you want to place virtually in your room.'
    },
    {
      icon: SparklesIcon,
      title: 'AI Detection',
      description: 'Our AI automatically detects and segments objects from your photos.'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Upload Room',
      description: 'Upload a photo of your room where you want to place the object.'
    },
    {
      icon: EyeIcon,
      title: 'Virtual Placement',
      description: 'Drag and drop objects anywhere in your room to see how they look.'
    }
  ]

  if (showDemo) {
    return <ObjectPlacer onBack={() => setShowDemo(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Place Objects
              <span className="text-gradient"> Virtually</span>
              <br />
              in Your Room
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Transform your interior design process. Take photos of furniture and objects, 
              then see how they look in your space without moving a single thing.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button 
                onClick={() => setShowDemo(true)}
                className="btn-primary text-lg px-8 py-3"
              >
                Try It Now - Free
              </button>
              <button className="btn-secondary text-lg px-8 py-3">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to transform your space visualization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who are already visualizing their perfect room layout.
          </p>
          <button 
            onClick={() => setShowDemo(true)}
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}