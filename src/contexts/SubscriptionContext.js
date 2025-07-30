import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({
    projects: 0,
    images: 0
  });

  const plans = {
    free: {
      name: 'Free',
      price: 0,
      projects: 3,
      images: 10,
      features: ['Basic object placement', 'Standard quality', 'Community support']
    },
    pro: {
      name: 'Pro',
      price: 9.99,
      projects: 50,
      images: 200,
      features: ['Advanced object placement', 'HD quality', 'Priority support', 'Custom backgrounds']
    },
    business: {
      name: 'Business',
      price: 29.99,
      projects: 500,
      images: 1000,
      features: ['All Pro features', 'API access', 'Team collaboration', 'White-label options']
    }
  };

  useEffect(() => {
    if (user) {
      // Load user's subscription and usage data
      const savedSubscription = localStorage.getItem(`subscription_${user.id}`);
      const savedUsage = localStorage.getItem(`usage_${user.id}`);
      
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      } else {
        setSubscription({
          plan: user.plan || 'free',
          status: 'active',
          startDate: new Date().toISOString()
        });
      }
      
      if (savedUsage) {
        setUsage(JSON.parse(savedUsage));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && subscription) {
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(subscription));
    }
  }, [subscription, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`usage_${user.id}`, JSON.stringify(usage));
    }
  }, [usage, user]);

  const upgradePlan = async (planName) => {
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setSubscription({
        plan: planName,
        status: 'active',
        startDate: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  const incrementUsage = (type) => {
    setUsage(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const canCreateProject = () => {
    if (!subscription) return false;
    const plan = plans[subscription.plan];
    return usage.projects < plan.projects;
  };

  const canProcessImage = () => {
    if (!subscription) return false;
    const plan = plans[subscription.plan];
    return usage.images < plan.images;
  };

  const getCurrentPlan = () => {
    if (!subscription) return plans.free;
    return plans[subscription.plan];
  };

  const value = {
    subscription,
    usage,
    plans,
    upgradePlan,
    incrementUsage,
    canCreateProject,
    canProcessImage,
    getCurrentPlan
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};