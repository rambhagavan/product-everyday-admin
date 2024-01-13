import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import {
    Avatar,
    Hidden,
    Icon,
    IconButton,
    MenuItem,
    useMediaQuery,
    Box,
    styled,
    useTheme
} from '@mui/material';
import { Span } from '../../Core/Typography';
import { themeShadows } from '../../AppTheme/themeColors';
import useSettings from '../../../hooks/useSettings';
import { topBarHeight } from '../../../core/constants';
import MenuIcon from '@mui/icons-material/Menu';
import AppMenu from '../../Core/AppMenu';
import { NotificationProvider } from '../../../context/NotificationContext';
import NotificationBar from '../../NotificationBar/NotificationBar';
import { getUserData } from '../../../services/Common';

const TopbarRoot = styled('div')({
    top: 0,
    zIndex: 96,
    height: topBarHeight,
    boxShadow: themeShadows[8],
    transition: 'all 0.3s ease'
});

const TopbarContainer = styled(Box)(({ theme }) => ({
    padding: '8px',
    paddingLeft: 18,
    paddingRight: 20,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
        paddingLeft: 16,
        paddingRight: 16
    },
    [theme.breakpoints.down('xs')]: {
        paddingLeft: 14,
        paddingRight: 16
    }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.primary
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    minWidth: 185,
    '& a': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none'
    },
    '& span': { marginRight: '10px', color: theme.palette.text.primary }
}));

const UserMenu = styled(Box)({
    padding: 4,
    display: 'flex',
    borderRadius: 24,
    cursor: 'pointer',
    alignItems: 'center',
    '& span': { margin: '0 8px' }
});

const LayoutTopBar = () => {
    const theme = useTheme();
    const { settings, updateSettings } = useSettings();
    const user = getUserData()

    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({ layoutSettings: { leftSidebar: { ...sidebarSettings } } });
    };

    const handleSidebarToggle = () => {
        let { layoutSettings } = settings;
        console.log(layoutSettings)
        let mode;
        if (isMdScreen) {
            mode = layoutSettings.leftSidebar.mode === 'close' ? 'mobile' : 'close';
        } else {
            mode = layoutSettings.leftSidebar.mode === 'full' ? 'close' : 'full';
        }
        updateSidebarMode({ mode });
    };
    return (
        <TopbarRoot>
            <TopbarContainer>
                <Box display="flex">
                    <StyledIconButton onClick={handleSidebarToggle}>
                        <MenuIcon />
                    </StyledIconButton>
                </Box>

                <Box display="flex" alignItems="center">
                    <NotificationProvider>
                        <NotificationBar />
                    </NotificationProvider>
                    <AppMenu
                        menuButton={
                            <UserMenu>
                                <Hidden xsDown>
                                    <Span>
                                        Hi <strong>{user.firstName}</strong>
                                    </Span>
                                </Hidden>
                                <Avatar src={user.avatar} sx={{ cursor: 'pointer' }} />
                            </UserMenu>
                        }
                    >
                        <StyledItem>
                            <Link to="/">
                                <Span> Home </Span>
                            </Link>
                        </StyledItem>

                        <StyledItem>
                            <Link to="/page-layouts/user-profile">
                                <Span> Profile </Span>
                            </Link>
                        </StyledItem>

                        <StyledItem>
                            <Span> Settings </Span>
                        </StyledItem>

                        <StyledItem>
                            <Span> Logout </Span>
                        </StyledItem>
                    </AppMenu>
                </Box>
            </TopbarContainer>
        </TopbarRoot>
    )
}

export default LayoutTopBar