import { useEffect, useRef, memo } from 'react';
import { ThemeProvider, useMediaQuery, Box, styled, useTheme, Grid } from '@mui/material';
import { sidenavCompactWidth, sideNavWidth } from '../../../core/constants';
import useSettings from '../../../hooks/useSettings';
import LayoutTopBar from './LayoutTopBar';
import SidenavTheme from '../../AppTheme/SidenavTheme';
import LayoutSideBar from './LayoutSideBar';

const LayoutRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    background: theme.palette.background.default
}));

const LayoutContainer = styled(Box)(({ width, open }) => ({
    height: '100vh',
    display: 'flex',
    flexGrow: '1',
    flexDirection: 'column',
    verticalAlign: 'top',
    marginLeft: width,
    position: 'relative',
    transition: 'all 0.3s ease',
    marginRight: open ? 50 : 0
}));

const ContentBox = styled(Box)(() => ({
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between'
}));


const Layout = ({ children }) => {
    const { settings, updateSettings } = useSettings();
    const { layoutSettings, secondarySidebar } = settings;
    const theme = useTheme();
    const layoutClasses = `theme-${theme.palette.type}`;
    const topbarTheme = settings.themes[layoutSettings.topbar.theme];

    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

    const ref = useRef({ isMdScreen, settings });

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layoutSettings;

    const getSidenavWidth = () => {
        switch (sidenavMode) {
            case 'full':
                return sideNavWidth;

            case 'compact':
                return sidenavCompactWidth;

            default:
                return '0px';
        }
    };

    const sidenavWidth = getSidenavWidth();

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layoutSettings.leftSidebar.mode;
        if (settings.layoutSettings.leftSidebar.show) {
            let mode = isMdScreen ? 'close' : sidebarMode;
            updateSettings({ layoutSettings: { leftSidebar: { mode } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);

    return (
        <LayoutRoot className={layoutClasses}>
            {showSidenav && sidenavMode !== 'close' && (
                <SidenavTheme>
                    <LayoutSideBar />
                </SidenavTheme>
            )}
            <LayoutContainer width={sidenavWidth}>
                <ThemeProvider theme={topbarTheme}>
                    <LayoutTopBar fixed={true} className="elevation-z8" />
                </ThemeProvider>
                <ContentBox>
                    {children}
                </ContentBox>
            </LayoutContainer>
        </LayoutRoot>
    )
}

export default Layout