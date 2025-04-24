import React from 'react';
import ComboBox from './components/ComboBox';


function App() {
  const fruits = [
    'Apple',
    'Banana',
    'Cherry',
    'Dragonfruit',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
    'Kiwi',
    'Lemon',
    'Mango',
    'Nectarine',
    'Orange',
    'Pineapple',
    'Raspberry',
    'Strawberry',
    'Tangerine',
    'Watermelon'
  ];

  return (
    <div className="app">
      <h1>Combo box with Arrow Navigation</h1>
      <p>Type to filter or use arrow keys to navigate</p>

      <div className="demo-container">
        <ComboBox options={fruits} placeholder="Search fruits..." />
      </div>
    </div>
  );
}

export default App;