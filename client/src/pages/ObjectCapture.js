import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Upload, Loader, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CaptureContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
`;

const CaptureContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
`;

const CaptureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CameraSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ResultsSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CameraContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: #000;
  aspect-ratio: 4/3;
`;

const StyledWebcam = styled(Webcam)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CameraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 1.1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background: ${props => props.primary ? '#5a6fd8' : 'rgba(255, 255, 255, 0.3)'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const ResultsContainer = styled.div`
  min-height: 300px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const DetectionResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetectedObject = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ObjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ObjectName = styled.span`
  color: white;
  font-weight: 600;
  text-transform: capitalize;
`;

const Confidence = styled.span`
  color: #4ade80;
  font-weight: 500;
`;

const ObjectBounds = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  
  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const ObjectCapture = () => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    detectObjects(imageSrc);
  }, [webcamRef]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        setCapturedImage(imageSrc);
        detectObjects(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectObjects = async (imageData) => {
    setIsLoading(true);
    setDetectedObjects([]);
    
    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
      
      // Send to backend
      const result = await axios.post('/api/detect-object', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setDetectedObjects(result.data.predictions);
      toast.success(`Detected ${result.data.predictions.length} objects!`);
    } catch (error) {
      console.error('Detection error:', error);
      toast.error(error.response?.data?.error || 'Object detection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setDetectedObjects([]);
  };

  const saveToProject = (object) => {
    // This would open a modal to save to a project
    toast.success(`Object "${object.class}" saved to project!`);
  };

  return (
    <CaptureContainer>
      <CaptureContent>
        <Title>Capture & Detect Objects</Title>
        
        <CaptureGrid>
          <CameraSection
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>
              <Camera size={20} />
              Camera
            </SectionTitle>
            
            <CameraContainer>
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : cameraEnabled ? (
                <StyledWebcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user"
                  }}
                />
              ) : (
                <CameraOverlay>
                  <div>
                    <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
                    <div>Camera not available</div>
                  </div>
                </CameraOverlay>
              )}
            </CameraContainer>
            
            <ButtonGroup>
              {capturedImage ? (
                <Button onClick={retake} disabled={isLoading}>
                  <RotateCcw size={16} />
                  Retake
                </Button>
              ) : (
                <Button primary onClick={capture} disabled={isLoading}>
                  <Camera size={16} />
                  Capture
                </Button>
              )}
              
              <FileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <FileInputLabel htmlFor="file-upload">
                <Upload size={16} />
                Upload
              </FileInputLabel>
              <FileInput id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} />
            </ButtonGroup>
          </CameraSection>
          
          <ResultsSection
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionTitle>
              <CheckCircle size={20} />
              Detected Objects
            </SectionTitle>
            
            <ResultsContainer>
              {isLoading ? (
                <LoadingState>
                  <Loader size={48} />
                  <div>Analyzing image...</div>
                </LoadingState>
              ) : detectedObjects.length > 0 ? (
                <DetectionResults>
                  {detectedObjects.map((object, index) => (
                    <DetectedObject key={index}>
                      <ObjectInfo>
                        <ObjectName>{object.class}</ObjectName>
                        <Confidence>{Math.round(object.score * 100)}%</Confidence>
                      </ObjectInfo>
                      <ObjectBounds>
                        Position: ({Math.round(object.bbox[0])}, {Math.round(object.bbox[1])}) 
                        Size: {Math.round(object.bbox[2])} × {Math.round(object.bbox[3])}
                      </ObjectBounds>
                      <ActionButtons>
                        <ActionButton onClick={() => saveToProject(object)}>
                          Save to Project
                        </ActionButton>
                        <ActionButton onClick={() => toast.info('AR placement coming soon!')}>
                          Place in AR
                        </ActionButton>
                      </ActionButtons>
                    </DetectedObject>
                  ))}
                </DetectionResults>
              ) : (
                <EmptyState>
                  <Camera size={48} />
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      No objects detected yet
                    </div>
                    <div>Capture or upload an image to get started</div>
                  </div>
                </EmptyState>
              )}
            </ResultsContainer>
          </ResultsSection>
        </CaptureGrid>
      </CaptureContent>
    </CaptureContainer>
  );
};

export default ObjectCapture;