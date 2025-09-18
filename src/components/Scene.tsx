import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { throttleRender } from '@/utils/fpsThrottle';
import { CAMERA_CONFIG } from '@/utils/constants';
import { initBackgroundMusic, playBackgroundMusic } from '@/sound/playBackgroundMusic';
import * as THREE from 'three';

/**
 * Audio component that initializes background music within Three.js context
 */
function AudioInitializer() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Create audio listener and attach to camera
    const listener = new THREE.AudioListener();
    camera.add(listener);
    
    // Initialize background music
    initBackgroundMusic(listener);
    
    // Start playing background music
    setTimeout(() => {
      playBackgroundMusic();
    }, 1000); // Small delay to ensure audio is loaded
    
    // Cleanup
    return () => {
      if (camera.children.includes(listener)) {
        camera.remove(listener);
      }
    };
  }, [camera]);

  return null; // This component doesn't render anything
}

/**
 * Scene wrapper component that provides the Three.js Canvas with
 * optimized rendering and lighting setup
 */
const Scene = ({ children }) => {
  return (
    <Canvas
      orthographic={true}
      shadows={true}
      camera={CAMERA_CONFIG}
      frameloop="always"
      onCreated={throttleRender}
    >
      <ambientLight />
      <AudioInitializer />
      {children}
    </Canvas>
  );
};

export default Scene;
