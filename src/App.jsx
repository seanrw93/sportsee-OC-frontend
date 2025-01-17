import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './scss/main.scss';
import './scss/base/_resets.scss';

import Layout from './components/Layout';
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} /> 
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;