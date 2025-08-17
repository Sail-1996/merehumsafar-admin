import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PrimeReactProvider } from 'primereact/api';



createRoot(document.getElementById('root')).render(
  <PrimeReactProvider value={{ ripple: true }}>
 <section className='dark:bg-gray-900'>
 <App />
 </section>
</PrimeReactProvider>
)
