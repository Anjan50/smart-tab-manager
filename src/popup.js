import React from 'react';
import { createRoot } from 'react-dom/client';
import TabManagerPopup from './components/TabManagerPopup.jsx';
import './styles/tailwind.css';  // Add this line

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<TabManagerPopup />);