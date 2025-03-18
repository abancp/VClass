import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bot, Star } from 'lucide-react';

const DraggableAIButton = ({ id }) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null); // Start with null to calculate on mount
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState([]);
  const buttonRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const clickTime = useRef(0);

  // Set initial position to bottom right corner on component mount
  useEffect(() => {
    const setInitialPosition = () => {
      const padding = 20; // Padding from the edges
      setPosition({
        x: window.innerWidth - 70 - padding,
        y: window.innerHeight - 70 - padding
      });
    };

    // Set position initially
    setInitialPosition();

    // Also update position if window is resized
    window.addEventListener('resize', setInitialPosition);

    return () => {
      window.removeEventListener('resize', setInitialPosition);
    };
  }, []);

  // Handle drag start
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent default browser behavior

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Store initial position for determining if it was a click or drag
      dragStartPos.current = {
        x: e.clientX,
        y: e.clientY
      };

      clickTime.current = Date.now();
      setIsDragging(true);
    }
  };

  // Handle drag movement
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      // Ensure the button stays within the viewport
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  // Handle drag end
  const handleMouseUp = (e) => {
    if (isDragging) {
      // Calculate distance moved during drag
      const distX = Math.abs(e.clientX - dragStartPos.current.x);
      const distY = Math.abs(e.clientY - dragStartPos.current.y);
      const timeDiff = Date.now() - clickTime.current;

      // If moved less than 5px and held for less than 200ms, consider it a click
      const isRealClick = distX < 5 && distY < 5 && timeDiff < 200;

      setIsDragging(false);

      if (isRealClick) {
        handleClick();
      }
    }
  };

  // Handle button click
  const handleClick = () => {
    setIsClicked(true);
    generateParticles();
    setTimeout(() => {
      navigate('/class/' + id + '?tab=vclass_ai');
    }, 200);
  };

  // Create particle effect
  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: 30,
        y: 30,
        size: Math.random() * 6 + 2,
        speedX: (Math.random() - 0.5) * 10,
        speedY: (Math.random() - 0.5) * 10,
        color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`,
        life: 100
      });
    }
    setParticles(newParticles);
  };

  // Update particles animation
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setInterval(() => {
        setParticles(prevParticles =>
          prevParticles
            .map(p => ({
              ...p,
              x: p.x + p.speedX,
              y: p.y + p.speedY,
              life: p.life - 2,
              size: p.size * 0.97
            }))
            .filter(p => p.life > 0)
        );
      }, 20);

      return () => clearInterval(timer);
    }
  }, [particles]);

  // Add window event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Define button animation styles
  const pulseAnimation = isHovered
    ? 'animate-pulse'
    : '';

  const clickAnimation = isClicked
    ? 'scale-90 opacity-100'
    : 'scale-100 opacity-100';

  // Star rotation animation
  const starAnimation = 'animate-spin';

  // Return null until position is calculated
  if (!position) return null;

  return (
    <div
      className="fixed z-[500]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.3s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      ref={buttonRef}
    >
      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.life / 100,
            transition: 'none'
          }}
        />
      ))}

      {/* Button */}
      <button
        className={`w-12 h-12 bg-gradient-to-br from-cyan-500 to-tersiory rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${pulseAnimation} ${clickAnimation}`}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Inner glow */}
        <div className="absolute w-10 h-10 bg-white opacity-30 rounded-full blur-sm"></div>

        {/* MessageSquareText icon */}
        <Bot className="text-dark/80 absolute" size={40} />

      </button>

      {/* Label that appears on hover */}
      <div
        className={`absolute top-14 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200 ${isHovered ? 'opacity-90' : 'opacity-0'}`}
      >
        Open AI Chat
      </div>
    </div>
  );
};

export default DraggableAIButton;
