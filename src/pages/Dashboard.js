import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Image, BarChart3, Settings, ArrowRight, Calendar, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { usage, getCurrentPlan, plans } = useSubscription();
  const [recentProjects] = useState([
    {
      id: 1,
      name: 'Living Room Redesign',
      thumbnail: 'https://via.placeholder.com/300x200',
      createdAt: '2024-01-15',
      objects: 3
    },
    {
      id: 2,
      name: 'Kitchen Furniture Test',
      thumbnail: 'https://via.placeholder.com/300x200',
      createdAt: '2024-01-10',
      objects: 2
    },
    {
      id: 3,
      name: 'Bedroom Layout',
      thumbnail: 'https://via.placeholder.com/300x200',
      createdAt: '2024-01-05',
      objects: 4
    }
  ]);

  const currentPlan = getCurrentPlan();

  const stats = [
    {
      title: 'Projects Created',
      value: usage.projects,
      max: currentPlan.projects,
      icon: Image,
      color: 'text-blue-600'
    },
    {
      title: 'Images Processed',
      value: usage.images,
      max: currentPlan.images,
      icon: BarChart3,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your virtual room projects and track your usage</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value} / {stat.max}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(stat.value / stat.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900">{currentPlan.name}</p>
                <p className="text-sm text-gray-500">${currentPlan.price}/month</p>
              </div>
              <div className="p-3 rounded-lg bg-primary-100 text-primary-600">
                <Settings className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/editor"
                  className="flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-600 text-white rounded-lg">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">Create New Project</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link
                  to="/pricing"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-600 text-white rounded-lg">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">Upgrade Plan</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-600 text-white rounded-lg">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">Export Data</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                <Link to="/editor" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.createdAt}</span>
                        </div>
                        <span>{project.objects} objects</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Comparison</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`p-6 rounded-lg border-2 ${
                    currentPlan.name === plan.name
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${plan.price}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {currentPlan.name === plan.name ? (
                    <button className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium">
                      Current Plan
                    </button>
                  ) : (
                    <Link
                      to="/pricing"
                      className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors block text-center"
                    >
                      Upgrade
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;