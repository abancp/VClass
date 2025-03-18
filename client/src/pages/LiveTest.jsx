import React, { useState } from 'react';

const VirtualChemistryLab = () => {
  // States for lab components
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [containers, setContainers] = useState([
    { id: 1, type: 'beaker', content: 'empty', color: 'transparent', position: 'left' },
    { id: 2, type: 'testTube', content: 'empty', color: 'transparent', position: 'middle-left' },
    { id: 3, type: 'flask', content: 'empty', color: 'transparent', position: 'middle-right' }
  ]);
  const [burnerState, setBurnerState] = useState('off');
  const [heatedContainer, setHeatedContainer] = useState(null);
  const [reactionMessage, setReactionMessage] = useState('');
  const [showReaction, setShowReaction] = useState(false);

  // Available chemicals
  const chemicals = [
    { id: 'acid', name: 'Hydrochloric Acid', color: 'rgba(255, 255, 200, 0.7)' },
    { id: 'base', name: 'Sodium Hydroxide', color: 'rgba(200, 200, 255, 0.7)' },
    { id: 'indicator', name: 'Phenolphthalein', color: 'rgba(255, 200, 255, 0.5)' },
    { id: 'salt', name: 'Copper Sulfate', color: 'rgba(100, 200, 255, 0.8)' },
    { id: 'water', name: 'Distilled Water', color: 'rgba(200, 240, 255, 0.5)' }
  ];

  // Handle chemical selection
  const handleChemicalSelect = (chemical) => {
    setSelectedChemical(chemical);
  };

  // Handle adding chemical to container
  const handleAddToContainer = (containerId) => {
    if (!selectedChemical) return;

    const updatedContainers = containers.map(container => {
      if (container.id === containerId) {
        return {
          ...container,
          content: selectedChemical.id,
          color: selectedChemical.color
        };
      }
      return container;
    });

    setContainers(updatedContainers);
    setSelectedChemical(null);
    checkReactions(updatedContainers);
  };

  // Toggle bunsen burner
  const toggleBurner = () => {
    const newState = burnerState === 'off' ? 'on' : 'off';
    setBurnerState(newState);
    
    if (newState === 'off') {
      setHeatedContainer(null);
    }
  };

  // Heat container
  const heatContainer = (containerId) => {
    if (burnerState === 'off') {
      setReactionMessage('Turn on the Bunsen burner first!');
      setShowReaction(true);
      setTimeout(() => setShowReaction(false), 2000);
      return;
    }

    setHeatedContainer(containerId);
    
    // Find the container
    const container = containers.find(c => c.id === containerId);
    if (!container || container.content === 'empty') return;

    // Check thermal reactions
    if (container.content === 'salt') {
      setReactionMessage('Copper Sulfate decomposes on heating: CuSO₄·5H₂O → CuSO₄ + 5H₂O');
      setShowReaction(true);
      
      // Update container appearance
      const updatedContainers = containers.map(c => {
        if (c.id === containerId) {
          return { ...c, color: 'rgba(255, 255, 255, 0.5)' };
        }
        return c;
      });
      
      setContainers(updatedContainers);
      setTimeout(() => setShowReaction(false), 3000);
    }
    
    else if (container.content === 'water') {
      setReactionMessage('Water is boiling: H₂O(l) → H₂O(g)');
      setShowReaction(true);
      setTimeout(() => setShowReaction(false), 3000);
    }
  };

  // Mix two containers
  const mixContainers = (container1Id, container2Id) => {
    const container1 = containers.find(c => c.id === container1Id);
    const container2 = containers.find(c => c.id === container2Id);
    
    if (!container1 || !container2 || 
        container1.content === 'empty' || 
        container2.content === 'empty') {
      return;
    }
    
    // Check for acid-base reaction
    if ((container1.content === 'acid' && container2.content === 'base') ||
        (container1.content === 'base' && container2.content === 'acid')) {
      setReactionMessage('Acid-Base Neutralization: HCl + NaOH → NaCl + H₂O');
      setShowReaction(true);
      
      // Update containers
      const updatedContainers = containers.map(c => {
        if (c.id === container1Id) {
          return { ...c, content: 'salt', color: 'rgba(230, 230, 230, 0.7)' };
        }
        if (c.id === container2Id) {
          return { ...c, content: 'empty', color: 'transparent' };
        }
        return c;
      });
      
      setContainers(updatedContainers);
      setTimeout(() => setShowReaction(false), 3000);
    }
    
    // Check for indicator reactions
    else if (container1.content === 'indicator' && container2.content === 'acid' ||
             container2.content === 'indicator' && container1.content === 'acid') {
      setReactionMessage('Phenolphthalein remains colorless in acid');
      setShowReaction(true);
      setTimeout(() => setShowReaction(false), 3000);
    }
    
    else if (container1.content === 'indicator' && container2.content === 'base' ||
             container2.content === 'indicator' && container1.content === 'base') {
      setReactionMessage('Phenolphthalein turns pink in base');
      setShowReaction(true);
      
      // Update container with base to show color change
      const baseContainerId = container1.content === 'base' ? container1Id : container2Id;
      const updatedContainers = containers.map(c => {
        if (c.id === baseContainerId) {
          return { ...c, color: 'rgba(255, 150, 220, 0.7)' };
        }
        return c;
      });
      
      setContainers(updatedContainers);
      setTimeout(() => setShowReaction(false), 3000);
    }
  };

  // Check for automatic reactions based on containers
  const checkReactions = (currentContainers) => {
    // Implementation could be added for automatic reactions based on proximity, etc.
  };

  // Reset the lab
  const resetLab = () => {
    setContainers([
      { id: 1, type: 'beaker', content: 'empty', color: 'transparent', position: 'left' },
      { id: 2, type: 'testTube', content: 'empty', color: 'transparent', position: 'middle-left' },
      { id: 3, type: 'flask', content: 'empty', color: 'transparent', position: 'middle-right' }
    ]);
    setBurnerState('off');
    setHeatedContainer(null);
    setSelectedChemical(null);
    setReactionMessage('');
    setShowReaction(false);
  };

  // Render container based on type
  const renderContainer = (container) => {
    switch (container.type) {
      case 'beaker':
        return (
          <div className="relative w-24 h-28 mx-auto">
            <div className="absolute inset-0 border-2 border-gray-400 rounded-b-lg">
              <div 
                className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-500"
                style={{ 
                  backgroundColor: container.color, 
                  height: '80%',
                  animation: heatedContainer === container.id ? 'bubble 1s infinite' : 'none'
                }}
              >
                {heatedContainer === container.id && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="bubble bubble-1"></div>
                    <div className="bubble bubble-2"></div>
                    <div className="bubble bubble-3"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-6 text-xs text-center w-full">Beaker</div>
            {container.content !== 'empty' && (
              <div className="absolute -top-6 text-xs text-center w-full">
                {chemicals.find(c => c.id === container.content)?.name || ''}
              </div>
            )}
          </div>
        );
        
      case 'testTube':
        return (
          <div className="relative w-8 h-28 mx-auto">
            <div className="absolute inset-0 border-2 border-gray-400 rounded-b-full">
              <div 
                className="absolute bottom-0 left-0 right-0 rounded-b-full transition-all duration-500"
                style={{ 
                  backgroundColor: container.color, 
                  height: '80%',
                  animation: heatedContainer === container.id ? 'bubble 1s infinite' : 'none'
                }}
              >
                {heatedContainer === container.id && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="bubble bubble-1"></div>
                    <div className="bubble bubble-2"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-6 text-xs text-center w-full">Test Tube</div>
            {container.content !== 'empty' && (
              <div className="absolute -top-6 text-xs text-center w-full">
                {chemicals.find(c => c.id === container.content)?.name || ''}
              </div>
            )}
          </div>
        );
        
      case 'flask':
        return (
          <div className="relative w-20 h-28 mx-auto">
            <div className="absolute inset-x-6 top-0 h-6 border-2 border-gray-400"></div>
            <div className="absolute inset-0 top-6 border-2 border-gray-400 rounded-full">
              <div 
                className="absolute bottom-0 left-0 right-0 rounded-b-full transition-all duration-500"
                style={{ 
                  backgroundColor: container.color, 
                  height: '70%',
                  animation: heatedContainer === container.id ? 'bubble 1s infinite' : 'none'
                }}
              >
                {heatedContainer === container.id && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="bubble bubble-1"></div>
                    <div className="bubble bubble-2"></div>
                    <div className="bubble bubble-3"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-6 text-xs text-center w-full">Flask</div>
            {container.content !== 'empty' && (
              <div className="absolute -top-6 text-xs text-center w-full">
                {chemicals.find(c => c.id === container.content)?.name || ''}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render the bunsen burner
  const renderBunsenBurner = () => {
    return (
      <div className="relative w-20 h-28 mx-auto">
        <div 
          className="cursor-pointer" 
          onClick={toggleBurner}
        >
          <div className="absolute inset-x-7 bottom-0 h-12 bg-gray-700 rounded"></div>
          <div className="absolute inset-x-5 bottom-12 h-4 bg-gray-500 rounded"></div>
          <div className="absolute inset-x-6 bottom-16 h-8 bg-gray-700 rounded-t-lg">
            {burnerState === 'on' && (
              <div className="absolute inset-x-1 -top-10 h-10">
                <div className="w-full h-full bg-gradient-to-t from-yellow-500 to-red-500 rounded-t-full opacity-70 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -bottom-6 text-xs text-center w-full">
          Bunsen Burner ({burnerState === 'on' ? 'ON' : 'OFF'})
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full bg-gray-100 p-4 rounded-lg">
      <style jsx>{`
        @keyframes bubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .bubble {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float 3s infinite ease-in-out;
        }
        .bubble-1 {
          width: 8px;
          height: 8px;
          bottom: 10%;
          left: 20%;
          animation-duration: 3s;
        }
        .bubble-2 {
          width: 6px;
          height: 6px;
          bottom: 20%;
          left: 50%;
          animation-duration: 4s;
        }
        .bubble-3 {
          width: 4px;
          height: 4px;
          bottom: 15%;
          left: 70%;
          animation-duration: 2s;
        }
        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
      `}</style>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Virtual Chemistry Lab</h1>
        <button 
          onClick={resetLab}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Lab
        </button>
      </div>
      
      {/* Chemical shelf */}
      <div className="bg-amber-50 p-4 mb-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Chemical Solutions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {chemicals.map(chemical => (
            <div 
              key={chemical.id}
              className={`text-center transition-all ${selectedChemical?.id === chemical.id ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-105'}`}
              onClick={() => handleChemicalSelect(chemical)}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto border-2 border-gray-400 cursor-pointer"
                style={{ backgroundColor: chemical.color }}
              ></div>
              <p className="text-xs mt-1 w-16 mx-auto">{chemical.name}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          {selectedChemical ? (
            <p className="text-sm">Selected: <span className="font-bold">{selectedChemical.name}</span> (Click on a container to add)</p>
          ) : (
            <p className="text-sm">Click on a chemical to select it</p>
          )}
        </div>
      </div>
      
      {/* Work bench */}
      <div className="bg-amber-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold mb-4">Laboratory Workbench</h2>
        
        <div className="grid grid-cols-4 gap-4">
          {/* Containers */}
          {containers.map(container => (
            <div 
              key={container.id}
              className={`text-center p-2 rounded-lg transition-all ${selectedChemical ? 'hover:bg-amber-200 cursor-pointer' : ''}`}
              onClick={() => selectedChemical && handleAddToContainer(container.id)}
            >
              {renderContainer(container)}
              
              <div className="mt-8 flex flex-col gap-2">
                <button 
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={container.content === 'empty' || burnerState === 'off'}
                  onClick={(e) => {
                    e.stopPropagation();
                    heatContainer(container.id);
                  }}
                >
                  Heat
                </button>
                
                <div className="flex justify-center gap-1">
                  {containers.filter(c => c.id !== container.id).map(otherContainer => (
                    <button
                      key={`mix-${container.id}-${otherContainer.id}`}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
                      disabled={container.content === 'empty' || otherContainer.content === 'empty'}
                      onClick={(e) => {
                        e.stopPropagation();
                        mixContainers(container.id, otherContainer.id);
                      }}
                    >
                      Mix with {otherContainer.type === 'beaker' ? 'B' : otherContainer.type === 'testTube' ? 'T' : 'F'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* Bunsen Burner */}
          <div className="text-center p-2 rounded-lg">
            {renderBunsenBurner()}
          </div>
        </div>
      </div>
      
      {/* Reaction display */}
      {showReaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">Chemical Reaction!</h3>
            <p className="mb-4">{reactionMessage}</p>
            <button 
              onClick={() => setShowReaction(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <ul className="text-sm list-disc list-inside">
          <li>Click on a chemical to select it, then click on a container to add it</li>
          <li>Turn on the Bunsen burner by clicking on it</li>
          <li>Click the "Heat" button to heat a container with the Bunsen burner</li>
          <li>Use the "Mix with" buttons to mix chemicals between containers</li>
          <li>Try these reactions:
            <ul className="ml-6 list-disc list-inside">
              <li>Mix acid and base to observe neutralization</li>
              <li>Mix indicator with acid or base to observe color changes</li>
              <li>Heat copper sulfate to observe decomposition</li>
              <li>Heat water to observe boiling</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VirtualChemistryLab;
