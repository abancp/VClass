import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateClass from './pages/CreateClass'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter ,Routes,Route} from 'react-router';
import ClassPage from './pages/Class';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="login" element={<Login/>} />
        <Route path="signup" element={<Signup/>} />
        <Route path="class/:id" element={<ClassPage/>} />
        <Route path="create/class" element={<CreateClass/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
