import { CssBaseline } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import routes from './route/routes';
import AppTheme from './components/AppTheme/AppTheme';
import Snackbar from './components/SnackBar/Snackbar';
import { SettingsProvider } from './context/SettingsContext';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  const content = useRoutes(routes);
  return (
    <SettingsProvider>
      <AuthContextProvider>
      <AppTheme>
        <CssBaseline />
        {content}
        <Snackbar />
      </AppTheme>
      </AuthContextProvider>
    </SettingsProvider>
  );
}

export default App;
