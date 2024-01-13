import React from 'react'
import { memo } from 'react';
import { Hidden, Switch, Box, styled, useTheme } from '@mui/material';
import { themeShadows } from '../../AppTheme/themeColors';
import useSettings from '../../../hooks/useSettings';
import { sidenavCompactWidth, sideNavWidth } from '../../../core/constants';
import { convertHexToRGB } from '../../../core/utils';
import Brand from '../../Core/Brand';
import SideNavOptions from '../../Core/SideNavOptions';
// import Sidenav from '../../Common/Core/Sidenav';

const SidebarNavRoot = styled(Box)(({ theme, width, bg, image }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: width,
    boxShadow: themeShadows[8],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    zIndex: 111,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    transition: 'all 250ms ease-in-out',
    backgroundImage: `linear-gradient(to bottom, rgba(${bg}, 0.96), rgba(${bg}, 0.96)), url(${image})`,
    '&:hover': {
        width: sideNavWidth,
        '& .sidenavHoverShow': { display: 'block' },
        '& .compactNavItem': {
            width: '100%',
            maxWidth: '100%',
            '& .nav-bullet': { display: 'block' },
            '& .nav-bullet-text': { display: 'none' }
        }
    }
}));

const NavListBox = styled(Box)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
});

const LayoutSideBar = () => {
    const theme = useTheme();
    const { settings, updateSettings } = useSettings();
    const leftSidebar = settings.layoutSettings.leftSidebar;
    const { mode, bgImgURL } = leftSidebar;

    const getSidenavWidth = () => {
        switch (mode) {
            case 'compact':
                return sidenavCompactWidth;

            default:
                return sideNavWidth;
        }
    };

    const primaryRGB = convertHexToRGB(theme.palette.primary.main);

    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({ layoutSettings: { leftSidebar: { ...sidebarSettings } } });
    };

    const handleSidenavToggle = () => {
        updateSidebarMode({ mode: mode === 'compact' ? 'full' : 'compact' });
    };
    return (
        <SidebarNavRoot image={bgImgURL} bg={primaryRGB} width={getSidenavWidth()}>
            <NavListBox>
                <Brand>
                    <Hidden smDown>
                        <Switch
                            onChange={handleSidenavToggle}
                            checked={leftSidebar.mode !== 'full'}
                            color="secondary"
                            size="small"
                        />
                    </Hidden>
                </Brand>
                {/* <Sidenav /> */}
                <SideNavOptions/>
            </NavListBox>
        </SidebarNavRoot>
    )
}

export default LayoutSideBar