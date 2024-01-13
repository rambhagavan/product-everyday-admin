import React from 'react'
import { CircularProgress, styled } from "@mui/material";

const StyledLoading = styled('div')({
    '& .loader': {
      opacity: "100%",
      position: "absolute",
      left: "45%",
      bottom: "45%",
      zIndex: "50000",
    },
    '& .modal': {
      opacity: "40%"
    }
  });

const Spinner = (props) => {
    return (
        <div className="d-flex justify-content-center">
            <div className={`spinner-border text-blue ${props.small}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    )
}

export default Spinner