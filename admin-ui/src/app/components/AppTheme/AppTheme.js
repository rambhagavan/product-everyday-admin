import { CssBaseline, ThemeProvider } from '@mui/material';
import useSettings from '../../hooks/useSettings';

const AppTheme = ({ children }) => {
  const { settings } = useSettings();
  let activeTheme = { ...settings.themes[settings.activeTheme] };
  return (
    <ThemeProvider theme={activeTheme}>
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;