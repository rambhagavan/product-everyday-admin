import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { hideSnackBar } from '../../redux/actions/snackBarActions';
import { Snackbar as MUISnackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

const Snackbar = ({ type, message }) => {

    const dispatch = useDispatch()
    const snackBar = useSelector(state => state.snackBarStateData)

    console.log(snackBar)

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        dispatch(hideSnackBar())
    };
    return (
        <>
            <MUISnackbar
                open={snackBar.show}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                TransitionComponent={TransitionLeft}>
                <Alert
                    onClose={handleClose}
                    severity={snackBar.type}
                    sx={{ width: '100%' }}
                    className={`alert-${snackBar.type}`}
                >
                    {snackBar.msg}
                </Alert>
            </MUISnackbar>

        </>
    )
}
Snackbar.defaultProps = {
    type: "success",
    message: "This is a success message!"
}

export default Snackbar