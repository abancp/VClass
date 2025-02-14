import React from 'react';
import { motion } from 'framer-motion';

const FloatingCubeLoader = () => {
  // Cube rotation animation
  const cubeVariants = {
    rotate: {
      rotateX: 360,
      rotateY: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  // Particle orbit animation
  const particleVariants = {
    orbit: {
      rotate: 360,
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        perspective: '1000px', // Add 3D perspective
      }}
    >
      {/* 3D Cube */}
      <motion.div
        style={{
          width: '100px',
          height: '100px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
        variants={cubeVariants}
        animate="rotate"
      >
        {/* Cube Faces */}
        {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face, index) => (
          <motion.div
            key={index}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(17, 146, 184, 0.1)', // Semi-transparent #1192B8
              border: '2px solid #1192B8', // #1192B8 border
              boxSizing: 'border-box',
              transform: `rotateX(${index * 90}deg) translateZ(50px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Orbiting Particles */}
      <motion.div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          transformStyle: 'preserve-3d',
        }}
        variants={particleVariants}
        animate="orbit"
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <motion.div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#1192B8', // #1192B8 color
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `rotate(${index * 60}deg) translateX(100px)`,
              boxShadow: '0 0 10px #1192B8, 0 0 20px #1192B8', // Glow effect with #1192B8
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default FloatingCubeLoader;
