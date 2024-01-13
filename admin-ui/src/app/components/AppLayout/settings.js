import { themes } from '../AppTheme/initThemes';
import layoutSettings from './Layout/LayoutSettings';

// UPDATE BELOW CODE
export const AppLayoutSettings = {
  activeLayout: 'layout', // layout1, layout2
  activeTheme: 'blue', // View all valid theme colors inside AppTheme/themeColors.js
  perfectScrollbar: false,

  themes: themes,
  layoutSettings, // open Layout/LayoutSettings.js

  secondarySidebar: {
    show: true,
    open: false,
    theme: 'slateDark1' // View all valid theme colors inside AppTheme/themeColors.js
  },
  // Footer options
  footer: {
    show: true,
    fixed: false,
    theme: 'slateDark1' // View all valid theme colors inside AppTheme/themeColors.js
  }
};
