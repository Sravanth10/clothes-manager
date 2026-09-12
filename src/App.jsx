import { useState } from 'react';
import { useWardrobe } from './hooks/useWardrobe';
import { WardrobeView } from './views/WardrobeView';
import { AvailabilityView } from './views/AvailabilityView';
import { SuggestionView } from './views/SuggestionView';
import { Shirt, CheckSquare, Sparkles } from 'lucide-react';

function App() {
  const { items, isLoading, addItem, removeItem, toggleAvailability } = useWardrobe();
  const [currentView, setCurrentView] = useState('wardrobe'); // 'wardrobe', 'availability', 'suggestion'

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <>
      {currentView === 'wardrobe' && (
        <WardrobeView items={items} addItem={addItem} removeItem={removeItem} />
      )}
      
      {currentView === 'availability' && (
        <AvailabilityView items={items} toggleAvailability={toggleAvailability} />
      )}
      
      {currentView === 'suggestion' && (
        <SuggestionView items={items} />
      )}

      {/* Floating Navigation Dock */}
      <nav className="floating-dock">
        <button 
          className={`dock-item ${currentView === 'wardrobe' ? 'active' : ''}`}
          onClick={() => setCurrentView('wardrobe')}
        >
          <Shirt size={20} />
          <span>Wardrobe</span>
        </button>
        <button 
          className={`dock-item ${currentView === 'availability' ? 'active' : ''}`}
          onClick={() => setCurrentView('availability')}
        >
          <CheckSquare size={20} />
          <span>Laundry</span>
        </button>
        <button 
          className={`dock-item ${currentView === 'suggestion' ? 'active' : ''}`}
          onClick={() => setCurrentView('suggestion')}
        >
          <Sparkles size={20} />
          <span>Today's Fit</span>
        </button>
      </nav>
    </>
  );
}

export default App;
