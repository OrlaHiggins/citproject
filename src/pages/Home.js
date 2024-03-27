// Home.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Make sure to provide the correct path to HomePage

function Home() {
  const location = useLocation();

  return (
    <div className="homepage">
      <HomePage userName={location.state.id} />
    </div>
  );
}

export default Home;
