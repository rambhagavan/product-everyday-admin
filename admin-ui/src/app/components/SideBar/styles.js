const drawerWidth = 250 
export const sidebarStyles = {
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "white",
            color: 'black',
        },
        '& .Mui-selected': {
            color: 'red',
        },
    },
    icons: {
        color: '#033b8e !important',
        marginLeft: '2px',
    },
    iconsWhite: {
        color: 'white !important',
        marginLeft: '2px',
    },
    text: {
        '& span': {
            marginLeft: '-10px',
            fontWeight: '600',
            fontSize: '12px',
            color:'black !important'
        }
    },
    textWhite: {
        '& span': {
            marginLeft: '-10px',
            fontWeight: '600',
            fontSize: '12px',
            color:'white !important'
        }
    },
    navBrand: {
        '& span': {
            marginLeft: '-10px',
            fontWeight: '600',
            fontSize: '12px',
        }
    },
};