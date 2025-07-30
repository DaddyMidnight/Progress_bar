import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Plane } from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCcw, Move, RotateCw, ZoomIn, ZoomOut, Save, Share } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ARContainer = styled.div`
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
`;

const ARContent = styled.div`
  height: 100vh;
  display: flex;
`;

const ViewerSection = styled.div`
  flex: 1;
  position: relative;
  background: #000;
`;

const ControlsPanel = styled(motion.div)`
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-300px'};
    height: 100%;
    z-index: 1000;
    transition: right 0.3s ease;
  }
`;

const PanelTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 2rem;
`;

const ControlGroup = styled.div`
  margin-bottom: 2rem;
`;

const ControlLabel = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
`;

const ControlButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.active {
    background: #667eea;
    border-color: #667eea;
  }
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  margin: 1rem 0;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #667eea;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #667eea;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const ObjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ObjectItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  
  &.selected {
    background: rgba(102, 126, 234, 0.3);
    border-color: #667eea;
  }
`;

const ObjectName = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
`;

const ObjectInfo = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  z-index: 100;
`;

const MobileToggle = styled.button`
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// 3D Object Components
function DetectedObject({ object, position, rotation, scale, isSelected, onClick }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getObjectGeometry = (className) => {
    // Map detected object classes to basic 3D shapes
    const shapeMap = {
      'person': 'box',
      'chair': 'box',
      'table': 'box',
      'sofa': 'box',
      'bed': 'box',
      'bottle': 'cylinder',
      'cup': 'cylinder',
      'bowl': 'sphere',
      'apple': 'sphere',
      'orange': 'sphere',
      'default': 'box'
    };
    
    return shapeMap[className] || shapeMap['default'];
  };

  const geometry = getObjectGeometry(object.detectedClass);
  const color = isSelected ? '#667eea' : '#4ade80';

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    >
      {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {geometry === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
      {geometry === 'cylinder' && <cylinderGeometry args={[0.3, 0.3, 1, 32]} />}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Room() {
  return (
    <>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#8b5cf6" opacity={0.3} transparent />
      </Plane>
      
      {/* Walls */}
      <Plane args={[20, 10]} position={[0, 3, -10]}>
        <meshStandardMaterial color="#6366f1" opacity={0.2} transparent />
      </Plane>
      <Plane args={[20, 10]} rotation={[0, Math.PI / 2, 0]} position={[-10, 3, 0]}>
        <meshStandardMaterial color="#6366f1" opacity={0.2} transparent />
      </Plane>
    </>
  );
}

const ARViewer = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [objectPositions, setObjectPositions] = useState({});
  const [objectRotations, setObjectRotations] = useState({});
  const [objectScales, setObjectScales] = useState({});

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      const projectData = response.data;
      setProject(projectData);
      
      // Initialize object positions, rotations, and scales
      const positions = {};
      const rotations = {};
      const scales = {};
      
      projectData.objects?.forEach((obj, index) => {
        const id = obj.id || index;
        positions[id] = [index * 2 - 2, 0, 0]; // Spread objects horizontally
        rotations[id] = [0, 0, 0];
        scales[id] = [1, 1, 1];
      });
      
      setObjectPositions(positions);
      setObjectRotations(rotations);
      setObjectScales(scales);
    } catch (error) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const updateObjectTransform = (objectId, type, axis, value) => {
    const setters = {
      position: setObjectPositions,
      rotation: setObjectRotations,
      scale: setObjectScales
    };
    
    const getters = {
      position: objectPositions,
      rotation: objectRotations,
      scale: objectScales
    };
    
    const current = getters[type][objectId] || [0, 0, 0];
    const axisMap = { x: 0, y: 1, z: 2 };
    const newTransform = [...current];
    newTransform[axisMap[axis]] = value;
    
    setters[type]({
      ...getters[type],
      [objectId]: newTransform
    });
  };

  const saveProject = async () => {
    try {
      const updatedObjects = project.objects.map((obj, index) => ({
        ...obj,
        positions: [{
          x: objectPositions[obj.id || index]?.[0] || 0,
          y: objectPositions[obj.id || index]?.[1] || 0,
          z: objectPositions[obj.id || index]?.[2] || 0,
          rotation: {
            x: objectRotations[obj.id || index]?.[0] || 0,
            y: objectRotations[obj.id || index]?.[1] || 0,
            z: objectRotations[obj.id || index]?.[2] || 0
          },
          scale: {
            x: objectScales[obj.id || index]?.[0] || 1,
            y: objectScales[obj.id || index]?.[1] || 1,
            z: objectScales[obj.id || index]?.[2] || 1
          }
        }]
      }));

      await axios.put(`/api/projects/${projectId}`, {
        ...project,
        objects: updatedObjects
      });
      
      toast.success('Project saved successfully!');
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  if (loading) {
    return (
      <ARContainer>
        <LoadingOverlay>Loading AR Viewer...</LoadingOverlay>
      </ARContainer>
    );
  }

  if (!project) {
    return (
      <ARContainer>
        <LoadingOverlay>Project not found</LoadingOverlay>
      </ARContainer>
    );
  }

  const selectedObjectId = selectedObject?.id || selectedObject;
  const selectedPos = objectPositions[selectedObjectId] || [0, 0, 0];
  const selectedRot = objectRotations[selectedObjectId] || [0, 0, 0];
  const selectedScale = objectScales[selectedObjectId] || [1, 1, 1];

  return (
    <ARContainer>
      <ARContent>
        <ViewerSection>
          <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Room />
            
            {project.objects?.map((object, index) => {
              const objectId = object.id || index;
              return (
                <DetectedObject
                  key={objectId}
                  object={object}
                  position={objectPositions[objectId] || [0, 0, 0]}
                  rotation={objectRotations[objectId] || [0, 0, 0]}
                  scale={objectScales[objectId] || [1, 1, 1]}
                  isSelected={selectedObjectId === objectId}
                  onClick={() => setSelectedObject(object)}
                />
              );
            })}
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          <MobileToggle onClick={() => setControlsOpen(!controlsOpen)}>
            ⚙️
          </MobileToggle>
        </ViewerSection>

        <ControlsPanel isOpen={controlsOpen}>
          <PanelTitle>AR Controls</PanelTitle>
          
          <ControlGroup>
            <ControlLabel>Objects</ControlLabel>
            <ObjectList>
              {project.objects?.map((object, index) => (
                <ObjectItem
                  key={object.id || index}
                  className={selectedObjectId === (object.id || index) ? 'selected' : ''}
                  onClick={() => setSelectedObject(object)}
                >
                  <ObjectName>{object.detectedClass || object.name}</ObjectName>
                  <ObjectInfo>Confidence: {Math.round((object.confidence || 0) * 100)}%</ObjectInfo>
                </ObjectItem>
              ))}
            </ObjectList>
          </ControlGroup>

          {selectedObject && (
            <>
              <ControlGroup>
                <ControlLabel>Position</ControlLabel>
                <div>
                  <label>X: {selectedPos[0].toFixed(2)}</label>
                  <Slider
                    type="range"
                    min="-10"
                    max="10"
                    step="0.1"
                    value={selectedPos[0]}
                    onChange={(e) => updateObjectTransform(selectedObjectId, 'position', 'x', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label>Y: {selectedPos[1].toFixed(2)}</label>
                  <Slider
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={selectedPos[1]}
                    onChange={(e) => updateObjectTransform(selectedObjectId, 'position', 'y', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label>Z: {selectedPos[2].toFixed(2)}</label>
                  <Slider
                    type="range"
                    min="-10"
                    max="10"
                    step="0.1"
                    value={selectedPos[2]}
                    onChange={(e) => updateObjectTransform(selectedObjectId, 'position', 'z', parseFloat(e.target.value))}
                  />
                </div>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>Rotation</ControlLabel>
                <div>
                  <label>X: {(selectedRot[0] * 180 / Math.PI).toFixed(0)}°</label>
                  <Slider
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.1"
                    value={selectedRot[0]}
                    onChange={(e) => updateObjectTransform(selectedObjectId, 'rotation', 'x', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label>Y: {(selectedRot[1] * 180 / Math.PI).toFixed(0)}°</label>
                  <Slider
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.1"
                    value={selectedRot[1]}
                    onChange={(e) => updateObjectTransform(selectedObjectId, 'rotation', 'y', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label>Z: {(selectedRot[2] * 180 / Math.PI).toFixed(0)}°</label>
                  <Slider
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.1"
                    value={selectedRot[2]}
                    onChange={(e) => updateObjectTransform(selectedObjectId, 'rotation', 'z', parseFloat(e.target.value))}
                  />
                </div>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>Scale</ControlLabel>
                <div>
                  <label>Size: {selectedScale[0].toFixed(2)}</label>
                  <Slider
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={selectedScale[0]}
                    onChange={(e) => {
                      const scale = parseFloat(e.target.value);
                      updateObjectTransform(selectedObjectId, 'scale', 'x', scale);
                      updateObjectTransform(selectedObjectId, 'scale', 'y', scale);
                      updateObjectTransform(selectedObjectId, 'scale', 'z', scale);
                    }}
                  />
                </div>
              </ControlGroup>
            </>
          )}

          <ActionButtons>
            <ActionButton onClick={saveProject}>
              <Save size={16} />
              Save
            </ActionButton>
            <ActionButton className="secondary" onClick={() => toast.info('Share feature coming soon!')}>
              <Share size={16} />
              Share
            </ActionButton>
          </ActionButtons>
        </ControlsPanel>
      </ARContent>
    </ARContainer>
  );
};

export default ARViewer;