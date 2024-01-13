import React, { useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { sidebarStyles } from './styles';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import useSettings from '../../hooks/useSettings';

const SideBarLink = ({ item }) => {
    const [open, setOpen] = React.useState(false);
    const { settings, updateSettings } = useSettings();
    const [mode, setmode] = useState("white")
    useEffect(() => {
        const theme = settings.layoutSettings.leftSidebar.theme
        if ( theme === "slateDark1" || theme === 'slateDark2' || theme === 'purpleDark1' || theme === 'purpleDark2' || theme === 'blueDark' ) {
            setmode("dark")
        }else{
            setmode('white')
        }
    }, [])
    

    const handleClick = () => {
        setOpen(!open);
    };
    if (!item.children) {
        return (
            <ListItem
                key={item.id}
                component={item.route && Link}
                to={item.route}
            >

                <ListItemIcon
                    sx={mode === 'dark' ? sidebarStyles.iconsWhite : sidebarStyles.icons}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    sx={mode === 'dark' ? sidebarStyles.textWhite: sidebarStyles.text}
                    primary={item.label}
                />
            </ListItem>
        )
    }
    return <>
        {item.children && (
            <>
                <ListItem
                    key={item.id}
                    onClick={handleClick}
                >
                    <ListItemIcon
                        sx={mode === 'dark' ? sidebarStyles.iconsWhite : sidebarStyles.icons}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        sx={mode === 'dark' ? sidebarStyles.textWhite: sidebarStyles.text}
                        primary={item.label}
                    />
                    <ListItemIcon
                        sx={mode === 'dark' ? sidebarStyles.iconsWhite : sidebarStyles.icons}
                    >
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemIcon>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map(childrenLink => (
                            <SideBarLink
                                key={childrenLink && childrenLink.link}
                                item={childrenLink}
                            />
                        ))}
                    </List>
                </Collapse>
            </>
        )}
    </>
}

export default SideBarLink