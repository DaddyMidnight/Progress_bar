import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Camera, Eye, Trash2, Edit, MoreVertical, TrendingUp, Users, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const CreateButton = styled(Link)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    color: white;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const ProjectsSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ProjectImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 3rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const ProjectMeta = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.primary {
    background: #667eea;
    border-color: #667eea;
    
    &:hover {
      background: #5a6fd8;
    }
  }
  
  &.danger {
    background: #ef4444;
    border-color: #ef4444;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const EmptyDescription = styled.p`
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalObjects: 0,
    apiUsage: 0
  });
  
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/profile');
      setStats({
        totalProjects: projects.length,
        totalObjects: projects.reduce((sum, project) => sum + (project.objects?.length || 0), 0),
        apiUsage: response.data.apiUsage?.monthly || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter(p => p._id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardContainer>
      <DashboardContent>
        <Header>
          <Title>Welcome back, {user?.email?.split('@')[0]}</Title>
          <CreateButton to="/capture">
            <Plus size={20} />
            New Project
          </CreateButton>
        </Header>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StatIcon>
              <Camera size={24} />
            </StatIcon>
            <StatValue>{stats.totalProjects}</StatValue>
            <StatLabel>Total Projects</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatIcon>
              <TrendingUp size={24} />
            </StatIcon>
            <StatValue>{stats.totalObjects}</StatValue>
            <StatLabel>Objects Detected</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatIcon>
              <Zap size={24} />
            </StatIcon>
            <StatValue>{stats.apiUsage}</StatValue>
            <StatLabel>API Calls This Month</StatLabel>
          </StatCard>
        </StatsGrid>

        <ProjectsSection>
          <SectionHeader>
            <SectionTitle>Recent Projects</SectionTitle>
          </SectionHeader>

          {loading ? (
            <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
              Loading projects...
            </div>
          ) : projects.length > 0 ? (
            <ProjectsGrid>
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProjectImage>
                    {project.roomImage ? (
                      <img src={project.roomImage} alt={project.name} />
                    ) : (
                      <Camera size={48} />
                    )}
                  </ProjectImage>
                  <ProjectContent>
                    <ProjectTitle>{project.name}</ProjectTitle>
                    <ProjectMeta>
                      {project.objects?.length || 0} objects • Created {formatDate(project.createdAt)}
                    </ProjectMeta>
                    <ProjectActions>
                      <ActionButton 
                        className="primary"
                        onClick={() => window.open(`/ar-viewer/${project._id}`, '_blank')}
                      >
                        <Eye size={16} />
                      </ActionButton>
                      <ActionButton>
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton 
                        className="danger"
                        onClick={() => deleteProject(project._id)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </ProjectActions>
                  </ProjectContent>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>📸</EmptyIcon>
              <EmptyTitle>No projects yet</EmptyTitle>
              <EmptyDescription>
                Create your first project by capturing an object and placing it virtually in your room.
              </EmptyDescription>
              <CreateButton to="/capture">
                <Plus size={20} />
                Create Your First Project
              </CreateButton>
            </EmptyState>
          )}
        </ProjectsSection>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;