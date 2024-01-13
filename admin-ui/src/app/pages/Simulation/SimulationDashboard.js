import { Grid } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const SimulationDashboard = () => {
    return (
        <Grid container spacing={2} sx={{ marginTop: 'px' }}>
            <Grid item xs={3}>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between px-md-1">
                            <div className="align-self-center">
                                <i className="fa fa-user text-danger fa-3x"></i>
                            </div>
                            <div className="text-end">
                                <Link to='/simulation-user'>
                                <h5>User API Actions</h5>
                                <p className="mb-0 text-small">Handle User Actions By API</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}

export default SimulationDashboard