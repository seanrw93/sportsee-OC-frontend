import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './scss/main.scss';
import './scss/base/_resets.scss';

import Layout from './components/Layout';
import UserProfile from './pages/UserProfile';

const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/user/:id" element={<UserProfile />} /> 
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;