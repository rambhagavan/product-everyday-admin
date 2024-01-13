import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const Modal = ({open, children}) => {
    const [isOpen, setisOpen] = useState(open)
    return (
        <Dialog
            // fullScreen       
            open={open}
            // onClose={handleClose}
        >{children}
        </Dialog>
    )
}

Modal.defaultProps = {
    open: false,
    content:<></>
  };

export default Modal