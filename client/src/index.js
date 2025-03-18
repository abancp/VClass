import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateClass from './pages/CreateClass'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router';
import ClassPage from './pages/Class';
import LiveTest from './pages/LiveTest';
import Live from './pages/Live';
import AddWork from './pages/AddWork';
import { Toaster } from 'sonner';
import AutoJoin from './pages/AutoJoin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toaster richColors={true} position="bottom-right" />
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="class/:id" element={<ClassPage />} />
        <Route path="class/:id/add/:type" element={<AddWork />} />
        <Route path="create/class" element={<CreateClass />} />
        <Route path="live" element={<LiveTest src="http://localhost:8080/hls/67b73cc8c92ee6306cfeaf26.m3u8" />} />
        <Route path="stream" element={<Live />} />
        <Route path="join" element={<AutoJoin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
