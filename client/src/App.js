import axios from 'axios';
import { useEffect } from 'react';
import './App.css';
import useStore from './store/store';

function App() {
  const setUsername = useStore((state)=>(state.setUsername))
  const setIsLogin = useStore((state)=>(state.setIsLogin))
  console.log("aban")
  
  return (
    <div className="w-full h-screen bg-red-500">
      <h1 className='text-blue-900'>AAA</h1>
    </div>
  );
}

export default App;
