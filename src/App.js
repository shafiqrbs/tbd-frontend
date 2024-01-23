import logo from './logo.svg';
import './App.css';
import {useState,useLayoutEffect} from "react";
import {TextInput, Checkbox, Button, Group, Box, AppShell} from '@mantine/core';
import { useForm } from '@mantine/form';
import AppShellDemo from "./component/AppShell";
document.body.classList.add("no-scroll")
function App() {
    document.body.style.overflow = "hidden"
    function useWindowSize() {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            function updateSize() {
                setSize([window.innerWidth, window.innerHeight]);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);
        return size;
    }
    let containerHeight = useWindowSize()[1] - 160 + "px";
    localStorage.setItem('containerHeight',containerHeight);
  return (
    <div className="App">
      <AppShellDemo/>
    </div>
  );
}

export default App;
