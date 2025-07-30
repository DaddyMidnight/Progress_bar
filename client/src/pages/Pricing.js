import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Users } from 'lucide-react';

const PricingContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
`;

const PricingContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const PricingCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &.popular {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    
    &::before {
      content: 'Most Popular';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      text-align: center;
      padding: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
    }
  }
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const PlanIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    color: white;
  }
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const PlanDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const PlanPrice = styled.div`
  margin-bottom: 2rem;
`;

const Price = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  
  .currency {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .period {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
  
  svg {
    color: #4ade80;
    flex-shrink: 0;
  }
`;

const PlanButton = styled(Link)`
  width: 100%;
  background: ${props => props.primary ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  display: block;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.primary ? 'linear-gradient(135deg, #5a6fd8, #6a5acd)' : 'rgba(255, 255, 255, 0.2)'};
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
`;

const FAQ = styled.section`
  margin-top: 4rem;
`;

const FAQTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const FAQItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FAQQuestion = styled.h4`
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FAQAnswer = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      icon: <Users size={24} />,
      description: 'Perfect for trying out ObjectPlacer',
      price: 0,
      period: 'forever',
      features: [
        '10 object detections per month',
        'Basic AR placement',
        '1 project',
        'Community support',
        'Standard processing speed'
      ],
      buttonText: 'Get Started Free',
      buttonLink: '/register'
    },
    {
      name: 'Pro',
      icon: <Zap size={24} />,
      description: 'For professionals and small teams',
      price: 9.99,
      period: 'month',
      popular: true,
      features: [
        '100 object detections per month',
        'Advanced AR placement',
        'Unlimited projects',
        'Priority support',
        'Fast processing speed',
        'Export capabilities',
        'Custom object training'
      ],
      buttonText: 'Start Pro Trial',
      buttonLink: '/register'
    },
    {
      name: 'Enterprise',
      icon: <Shield size={24} />,
      description: 'For large teams and organizations',
      price: 29.99,
      period: 'month',
      features: [
        '1000 object detections per month',
        'Premium AR features',
        'Unlimited projects',
        '24/7 priority support',
        'Ultra-fast processing',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager'
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/register'
    }
  ];

  const faqs = [
    {
      question: 'How does object detection work?',
      answer: 'We use advanced AI models to automatically identify and extract objects from your photos with high accuracy.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support all common image formats including JPEG, PNG, WebP, and more.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Currently we offer a web-based solution that works great on mobile browsers. Native apps are coming soon!'
    }
  ];

  return (
    <PricingContainer>
      <PricingContent>
        <Header>
          <Title>Simple, Transparent Pricing</Title>
          <Subtitle>
            Choose the perfect plan for your needs. Start free and upgrade as you grow.
          </Subtitle>
        </Header>

        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              className={plan.popular ? 'popular' : ''}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PlanIcon>{plan.icon}</PlanIcon>
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              
              <PlanPrice>
                <Price>
                  <span className="currency">$</span>
                  {plan.price}
                  <span className="period">/{plan.period}</span>
                </Price>
              </PlanPrice>

              <FeatureList>
                {plan.features.map((feature, featureIndex) => (
                  <Feature key={featureIndex}>
                    <Check size={16} />
                    {feature}
                  </Feature>
                ))}
              </FeatureList>

              <PlanButton 
                to={plan.buttonLink}
                primary={plan.popular}
              >
                {plan.buttonText}
              </PlanButton>
            </PricingCard>
          ))}
        </PricingGrid>

        <FAQ>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          <FAQGrid>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FAQQuestion>{faq.question}</FAQQuestion>
                <FAQAnswer>{faq.answer}</FAQAnswer>
              </FAQItem>
            ))}
          </FAQGrid>
        </FAQ>
      </PricingContent>
    </PricingContainer>
  );
};

export default Pricing;