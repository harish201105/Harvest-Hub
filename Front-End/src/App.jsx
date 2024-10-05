import React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ThemeProvider } from '@mui/material';
import theme from './config/theme';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';
import { NicProvider } from './components/NicContext.jsx';

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <ProSidebarProvider>
          <CssBaseline /> {/* To add CSS basic rules */}
          <BrowserRouter>
            <NicProvider>
              <AppRoutes /> {/* Only renders routes */}
            </NicProvider>
          </BrowserRouter>
        </ProSidebarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
