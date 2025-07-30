import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Zap, TrendingUp, Settings, CreditCard, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const ProfileContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
`;

const ProfileContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
  font-weight: 700;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
`;

const SubscriptionBadge = styled.div`
  background: ${props => {
    switch(props.plan) {
      case 'pro': return 'linear-gradient(135deg, #667eea, #764ba2)';
      case 'enterprise': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  
  svg {
    color: #667eea;
  }
`;

const StatsSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const UsageBar = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const UsageProgress = styled.div`
  background: linear-gradient(90deg, #4ade80, #22c55e);
  height: 100%;
  border-radius: 10px;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const UsageText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-align: center;
`;

const SubscriptionSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const PlanDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PlanInfo = styled.div`
  color: white;
`;

const PlanName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const PlanPrice = styled.div`
  color: rgba(255, 255, 255, 0.7);
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#ef4444' : '#667eea'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.danger ? '#dc2626' : '#5a6fd8'};
    transform: translateY(-1px);
  }
`;

const Profile = () => {
  const { user, fetchProfile } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalObjects: 0,
    apiUsage: 0
  });

  useEffect(() => {
    if (user) {
      // Mock stats - in real app, fetch from API
      setStats({
        totalProjects: 5,
        totalObjects: 23,
        apiUsage: user.apiUsage?.monthly || 0
      });
    }
  }, [user]);

  const getUsageLimit = (plan) => {
    const limits = {
      free: 10,
      pro: 100,
      enterprise: 1000
    };
    return limits[plan] || 10;
  };

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const usageLimit = getUsageLimit(user?.subscription);
  const usagePercentage = (stats.apiUsage / usageLimit) * 100;

  const handleUpgrade = () => {
    toast.info('Redirecting to upgrade page...');
    // In real app, redirect to Stripe checkout
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      toast.info('Subscription cancellation requested');
      // In real app, call API to cancel subscription
    }
  };

  if (!user) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
            Loading profile...
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <Header>
          <Title>Profile</Title>
        </Header>

        <ProfileGrid>
          <ProfileCard
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Avatar>{getInitials(user.email)}</Avatar>
            <UserInfo>
              <UserName>{user.email?.split('@')[0]}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <SubscriptionBadge plan={user.subscription}>
                {user.subscription} Plan
              </SubscriptionBadge>
            </UserInfo>

            <InfoSection>
              <InfoItem>
                <Mail size={20} />
                <span>{user.email}</span>
              </InfoItem>
              <InfoItem>
                <Calendar size={20} />
                <span>Joined {formatDate(user.createdAt || new Date())}</span>
              </InfoItem>
              <InfoItem>
                <Shield size={20} />
                <span>{user.subscription} Subscription</span>
              </InfoItem>
            </InfoSection>
          </ProfileCard>

          <div>
            <StatsSection
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SectionTitle>
                <TrendingUp size={20} />
                Usage Statistics
              </SectionTitle>
              
              <StatsGrid>
                <StatCard>
                  <StatValue>{stats.totalProjects}</StatValue>
                  <StatLabel>Total Projects</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.totalObjects}</StatValue>
                  <StatLabel>Objects Detected</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.apiUsage}</StatValue>
                  <StatLabel>API Calls This Month</StatLabel>
                </StatCard>
              </StatsGrid>

              <div>
                <UsageBar>
                  <UsageProgress percentage={Math.min(usagePercentage, 100)} />
                </UsageBar>
                <UsageText>
                  {stats.apiUsage} / {usageLimit} API calls used this month
                </UsageText>
              </div>
            </StatsSection>

            <SubscriptionSection
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SectionTitle>
                <CreditCard size={20} />
                Subscription Management
              </SectionTitle>

              <PlanDetails>
                <PlanInfo>
                  <PlanName>{user.subscription} Plan</PlanName>
                  <PlanPrice>
                    {user.subscription === 'free' ? 'Free forever' : 
                     user.subscription === 'pro' ? '$9.99/month' : '$29.99/month'}
                  </PlanPrice>
                </PlanInfo>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {user.subscription === 'free' ? (
                    <ActionButton onClick={handleUpgrade}>
                      Upgrade Plan
                    </ActionButton>
                  ) : (
                    <>
                      <ActionButton onClick={handleUpgrade}>
                        Change Plan
                      </ActionButton>
                      <ActionButton danger onClick={handleCancelSubscription}>
                        Cancel
                      </ActionButton>
                    </>
                  )}
                </div>
              </PlanDetails>

              {user.subscription !== 'free' && (
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem'
                }}>
                  Your subscription will renew automatically. You can cancel anytime and 
                  continue using the service until the end of your billing period.
                </div>
              )}
            </SubscriptionSection>
          </div>
        </ProfileGrid>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;