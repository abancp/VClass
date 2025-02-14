import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CheckAnimation = () => {
  const [isChecked, setIsChecked] = useState(true);


  // Bubble particles with splash effect
  const bubbles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    angle: Math.random() * 2 * Math.PI, // Random angle for radial spread
    distance: Math.random() * 100 + 50, // Random distance from center
    size: Math.random() * 10 + 5, // Random size
    delay: Math.random() * 0.5, // Random delay
  }));

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ position: "relative", cursor: "pointer" }} >
        {/* Checkmark circle */}
        <motion.div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: isChecked ? "#1192B8" : "#E0E0E0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          animate={{ scale: isChecked ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Checkmark icon */}
          <motion.svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ opacity: isChecked ? 1 : 0, scale: isChecked ? 1 : 0.5 }}
            transition={{ duration: 0.3, delay: isChecked ? 0.2 : 0 }}
          >
            {/* Diagonal tick from bottom-left to top-right */}
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isChecked ? 1 : 0 }}
              transition={{ duration: 0.5, delay: isChecked ? 0.3 : 0, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Bubble particles with splash effect */}
        <AnimatePresence>
          {isChecked &&
            bubbles.map((bubble) => {
              // Convert polar coordinates (angle, distance) to Cartesian coordinates (x, y)
              const x = Math.cos(bubble.angle) * bubble.distance;
              const y = Math.sin(bubble.angle) * bubble.distance;

              return (
                <motion.div
                  key={bubble.id}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: bubble.size,
                    height: bubble.size,
                    borderRadius: "50%",
                    backgroundColor: "#34C759",
                    opacity: 0,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0.5, 1],
                    x: x,
                    y: y,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: bubble.delay,
                  }}
                />
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckAnimation;
