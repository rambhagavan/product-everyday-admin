import { CssBaseline } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import routes from './route/routes';
import AppTheme from './components/AppTheme/AppTheme';
import Snackbar from './components/SnackBar/Snackbar';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  const content = useRoutes(routes);
  return (
    <SettingsProvider>
      <AppTheme>
        <CssBaseline />
        {content}
        <Snackbar />
      </AppTheme>
    </SettingsProvider>
  );
}

export default App;
