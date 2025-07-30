import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import toast from 'react-hot-toast';

const Pricing = () => {
  const { user } = useAuth();
  const { plans, getCurrentPlan, upgradePlan } = useSubscription();
  const [loading, setLoading] = useState(null);

  const currentPlan = getCurrentPlan();

  const features = [
    'AI-powered object detection',
    'Realistic lighting and shadows',
    'High-quality renders',
    'Export in multiple formats',
    'Cloud storage',
    'Priority support'
  ];

  const handleUpgrade = async (planName) => {
    if (!user) {
      toast.error('Please log in to upgrade your plan');
      return;
    }

    setLoading(planName);
    try {
      await upgradePlan(planName);
      toast.success(`Successfully upgraded to ${plans[planName].name} plan!`);
    } catch (error) {
      toast.error('Failed to upgrade plan. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Start with our free plan and upgrade as you grow. All plans include our core features with different usage limits.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(plans).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl shadow-lg ${
                currentPlan.name === plan.name
                  ? 'bg-primary-600 text-white border-2 border-primary-600'
                  : 'bg-white text-gray-900 border-2 border-gray-200'
              }`}
            >
              {currentPlan.name === plan.name && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-lg opacity-75">/month</span>
                  </div>
                  <p className="text-sm opacity-75">
                    {plan.name === 'Free' ? 'Perfect for getting started' : 
                     plan.name === 'Pro' ? 'Great for professionals' : 'Best for teams and businesses'}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Projects</span>
                    <span className="font-semibold">{plan.projects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Images per month</span>
                    <span className="font-semibold">{plan.images}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {currentPlan.name === plan.name ? (
                  <button className="w-full py-3 px-4 bg-white bg-opacity-20 rounded-lg font-medium">
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={loading === key}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      currentPlan.name === plan.name
                        ? 'bg-white bg-opacity-20'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    } disabled:opacity-50`}
                  >
                    {loading === key ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      currentPlan.name === plan.name ? 'Current Plan' : 'Upgrade'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            All Plans Include
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-3"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600">
                You'll receive a notification when you're close to your limits. You can upgrade your plan to continue.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Our free plan includes all core features with limited usage. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time and continue using the free plan.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of users who are already creating amazing virtual room designs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                    Start Free Trial
                  </Link>
                  <Link to="/login" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors">
                    Sign In
                  </Link>
                </>
              ) : (
                <Link to="/editor" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                  Start Creating
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;