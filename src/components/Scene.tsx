import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { throttleRender } from '@/utils/fpsThrottle';
import { CAMERA_CONFIG } from '@/utils/constants';
import { initBackgroundMusic, playBackgroundMusic } from '@/sound/playBackgroundMusic';

/**
 * Scene wrapper component that provides the Three.js Canvas with
 * optimized rendering and lighting setup
 */
const Scene = ({ children }) => {
  useEffect(() => {
    // Initialize background music when component mounts
    const initAudio = () => {
      // Create audio listener
      const listener = new (window as any).THREE.AudioListener();
      
      // Initialize background music
      initBackgroundMusic(listener);
      
      // Start playing background music
      setTimeout(() => {
        playBackgroundMusic();
      }, 1000); // Small delay to ensure audio is loaded
    };

    initAudio();
  }, []);

  return (
    <Canvas
      orthographic={true}
      shadows={true}
      camera={CAMERA_CONFIG}
      frameloop="always"
      onCreated={throttleRender}
    >
      <ambientLight />
      {children}
    </Canvas>
  );
};

export default Scene;
