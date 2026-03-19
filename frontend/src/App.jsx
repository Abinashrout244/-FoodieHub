import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A2E',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#FF6B35', secondary: '#fff' },
            },
          }}
        />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
