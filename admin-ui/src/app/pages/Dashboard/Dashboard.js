import React, { useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    registerables
} from 'chart.js'

import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Grid } from '@mui/material';
import { ContentBox } from '../../styles/AppStyles';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ...registerables,
)
const Dashboard = () => {
    const noofusers = {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
        datasets: [{
            label: 'Total Sales',
            data: ['2000', '1996', '2015', '3000', '4515', '5000'],
            backgroundColor: [
                'rgba(18,102,241,1)',
                'rgba(18,102,241,1)',
                'rgba(18,102,241,1)',
                'rgba(18,102,241,1)',
                'rgba(18,102,241,1)',
                'rgba(18,102,241,1)',
            ],
            borderColor: [
                'rgb(18,102,241)',
                'rgb(18,102,241)',
                'rgb(18,102,241)',
                'rgb(18,102,241)',
                'rgb(18,102,241)',
                'rgb(18,102,241)',
            ],
            borderWidth: 4
        }]
    }
    return (
        <ContentBox>
            <div class="row">
                <div class="col-md-6 col-xxl-3 mb-3 pr-md-2">
                    <div class="card h-md-100 bg-pink text-white">
                        <div class="card-header pb-1">
                            <h6 class="mb-0 mt-2 d-flex align-items-center">Weekly Sales<span class="ml-1 text-400" data-toggle="tooltip" data-placement="top" title="Calculated according to last week's sales"><span class="far fa-question-circle" data-fa-transform="shrink-1"></span></span>
                            </h6>
                        </div>
                        <div class="card-body d-flex align-items-end">
                            <div class="row flex-grow-1">
                                <div class="col">
                                    <div class="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">$47K</div><span class="badge badge-pill fs--2 badge-success">+3.5%</span>
                                </div>
                                <div class="col-auto pl-0">
                                    <div class="echart-bar-weekly-sales h-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xxl-3 mb-3 pl-md-2 pr-xxl-2">
                    <div class="card h-md-100 bg-green text-white">
                        <div class="card-header pb-1">
                            <h6 class="mb-0 mt-2">Total Order</h6>
                        </div>
                        <div class="card-body pt-0">
                            <div class="row h-100">
                                <div class="col align-self-end">
                                    <div class="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">58.4K</div><span class="badge badge-pill fs--2"><span class="fas fa-caret-up mr-1"></span>13.6%</span>
                                </div>
                                <div class="col-auto pl-0">
                                    <div class="echart-line-total-order h-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xxl-3 mb-3 pl-md-2 pr-xxl-2">
                    <div class="card h-md-100 bg-blue text-white">
                        <div class="card-header pb-1">
                            <h6 class="mb-0 mt-2">Total Users</h6>
                        </div>
                        <div class="card-body pt-0">
                            <div class="row h-100">
                                <div class="col align-self-end">
                                    <div class="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">12K</div><span class="badge badge-pill fs--2"><span class="fas fa-caret-up mr-1"></span>13.6%</span>
                                </div>
                                <div class="col-auto pl-0">
                                    <div class="echart-line-total-order h-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xxl-3 mb-3 pl-md-2">
                    <div class="card h-md-100">
                        <div class="card-header d-flex flex-between-center pb-0">
                            <h6 class="mb-0">Weather</h6>
                            <div class="dropdown text-sans-serif btn-reveal-trigger">
                                <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type="button" id="dropdown-weather-update" data-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span class="fas fa-ellipsis-h fs--2"></span></button>
                                <div class="dropdown-menu dropdown-menu-right border py-0" aria-labelledby="dropdown-weather-update">
                                    <div class="bg-white py-2"><a class="dropdown-item" href="#!">View</a><a class="dropdown-item" href="#!">Export</a>
                                        <div class="dropdown-divider"></div><a class="dropdown-item text-danger" href="#!">Remove</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body pt-2">
                            <div class="row no-gutters h-100 align-items-center">
                                <div class="col">
                                    <div class="media align-items-center"><img class="mr-3" src="../assets/img/icons/weather-icon.png" alt="" height="60" />
                                        <div class="media-body">
                                            <h6 class="mb-2">New York City</h6>
                                            <div class="fs--2 font-weight-semi-bold">
                                                <div class="text-warning">Sunny</div>Precipitation: 50%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-auto text-center pl-2">
                                    <div class="fs-4 font-weight-normal text-sans-serif text-primary mb-1 line-height-1">31&deg;</div>
                                    <div class="fs--1 text-800">32&deg; / 25&deg;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 pr-lg-2 mb-3">
                    <div class="card h-lg-100 overflow-hidden">
                        <div class="card-header bg-light">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h6 class="mb-0">Running Projects</h6>
                                </div>
                                <div class="col-auto text-center pr-card">
                                    <select class="custom-select custom-select-sm">
                                        <option>Working Time</option>
                                        <option>Estimated Time</option>
                                        <option>Billable Time</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="row no-gutters align-items-center py-2 position-relative border-bottom border-200">
                                <div class="col pl-card py-1 position-static">
                                    <div class="media align-items-center">
                                        <div class="avatar avatar-xl mr-3">
                                            <div class="avatar-name rounded-circle bg-soft-primary text-dark"><span class="fs-0 text-primary">F</span></div>
                                        </div>
                                        <div class="media-body">
                                            <h6 class="mb-0 d-flex align-items-center"><a class="text-800 stretched-link" href="#!">Falcon</a><span class="badge badge-pill ml-2 bg-200 text-primary">38%</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col py-1">
                                    <div class="row flex-end-center no-gutters">
                                        <div class="col-auto pr-2">
                                            <div class="fs--1 font-weight-semi-bold">12:50:00</div>
                                        </div>
                                        <div class="col-5 pr-card pl-2">
                                            <div class="progress mr-2" style={{"height": "5px"}}>
                                                <div class="progress-bar rounded-capsule" role="progressbar" style={{"width": "38%"}} aria-valuenow="38" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row no-gutters align-items-center py-2 position-relative border-bottom border-200">
                                <div class="col pl-card py-1 position-static">
                                    <div class="media align-items-center">
                                        <div class="avatar avatar-xl mr-3">
                                            <div class="avatar-name rounded-circle bg-soft-success text-dark"><span class="fs-0 text-success">R</span></div>
                                        </div>
                                        <div class="media-body">
                                            <h6 class="mb-0 d-flex align-items-center"><a class="text-800 stretched-link" href="#!">Reign</a><span class="badge badge-pill ml-2 bg-200 text-primary">79%</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col py-1">
                                    <div class="row flex-end-center no-gutters">
                                        <div class="col-auto pr-2">
                                            <div class="fs--1 font-weight-semi-bold">25:20:00</div>
                                        </div>
                                        <div class="col-5 pr-card pl-2">
                                            <div class="progress mr-2" style={{"height": "5px"}}>
                                                <div class="progress-bar rounded-capsule" role="progressbar" style={{"width": "79%"}} aria-valuenow="79" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row no-gutters align-items-center py-2 position-relative border-bottom border-200">
                                <div class="col pl-card py-1 position-static">
                                    <div class="media align-items-center">
                                        <div class="avatar avatar-xl mr-3">
                                            <div class="avatar-name rounded-circle bg-soft-info text-dark"><span class="fs-0 text-info">B</span></div>
                                        </div>
                                        <div class="media-body">
                                            <h6 class="mb-0 d-flex align-items-center"><a class="text-800 stretched-link" href="#!">Boots4</a><span class="badge badge-pill ml-2 bg-200 text-primary">90%</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col py-1">
                                    <div class="row flex-end-center no-gutters">
                                        <div class="col-auto pr-2">
                                            <div class="fs--1 font-weight-semi-bold">58:20:00</div>
                                        </div>
                                        <div class="col-5 pr-card pl-2">
                                            <div class="progress mr-2" style={{"height": "5px"}}>
                                                <div class="progress-bar rounded-capsule" role="progressbar" style={{"width": "90%"}} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row no-gutters align-items-center py-2 position-relative border-bottom border-200">
                                <div class="col pl-card py-1 position-static">
                                    <div class="media align-items-center">
                                        <div class="avatar avatar-xl mr-3">
                                            <div class="avatar-name rounded-circle bg-soft-warning text-dark"><span class="fs-0 text-warning">R</span></div>
                                        </div>
                                        <div class="media-body">
                                            <h6 class="mb-0 d-flex align-items-center"><a class="text-800 stretched-link" href="#!">Raven</a><span class="badge badge-pill ml-2 bg-200 text-primary">40%</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col py-1">
                                    <div class="row flex-end-center no-gutters">
                                        <div class="col-auto pr-2">
                                            <div class="fs--1 font-weight-semi-bold">21:20:00</div>
                                        </div>
                                        <div class="col-5 pr-card pl-2">
                                            <div class="progress mr-2" style={{"height": "5px"}}>
                                                <div class="progress-bar rounded-capsule" role="progressbar" style={{"width": "40%"}} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row no-gutters align-items-center py-2 position-relative">
                                <div class="col pl-card py-1 position-static">
                                    <div class="media align-items-center">
                                        <div class="avatar avatar-xl mr-3">
                                            <div class="avatar-name rounded-circle bg-soft-danger text-dark"><span class="fs-0 text-danger">S</span></div>
                                        </div>
                                        <div class="media-body">
                                            <h6 class="mb-0 d-flex align-items-center"><a class="text-800 stretched-link" href="#!">Slick</a><span class="badge badge-pill ml-2 bg-200 text-primary">70%</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col py-1">
                                    <div class="row flex-end-center no-gutters">
                                        <div class="col-auto pr-2">
                                            <div class="fs--1 font-weight-semi-bold">31:20:00</div>
                                        </div>
                                        <div class="col-5 pr-card pl-2">
                                            <div class="progress mr-2" style={{"height": "5px"}}>
                                                <div class="progress-bar rounded-capsule" role="progressbar" style={{"width": "70%"}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-light p-0"><a class="btn btn-sm btn-link btn-block py-2" href="#!">Show all projects<span class="fas fa-chevron-right ml-1 fs--2"></span></a></div>
                    </div>
                </div>
                <div class="col-lg-6 pl-lg-2 mb-3">
                    <div class="card h-lg-100">
                        <div class="card-header">
                            <div class="row flex-between-center">
                                <div class="col-auto">
                                    <h6 class="mb-0">Total Sales</h6>
                                </div>
                                <div class="col-auto d-flex">
                                    <select class="custom-select custom-select-sm select-month mr-2">
                                        <option value="0">January</option>
                                        <option value="1">February</option>
                                        <option value="2">March</option>
                                        <option value="3">April</option>
                                        <option value="4">May</option>
                                        <option value="5">Jun</option>
                                        <option value="6">July</option>
                                        <option value="7">August</option>
                                        <option value="8">September</option>
                                        <option value="9">October</option>
                                        <option value="10">November</option>
                                        <option value="11">December</option>
                                    </select>
                                    <div class="dropdown text-sans-serif btn-reveal-trigger">
                                        <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type="button" id="dropdown-total-saldes" data-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span class="fas fa-ellipsis-h fs--2"></span></button>
                                        <div class="dropdown-menu dropdown-menu-right border py-0" aria-labelledby="dropdown-total-saldes">
                                            <div class="bg-white py-2"><a class="dropdown-item" href="#!">View</a><a class="dropdown-item" href="#!">Export</a>
                                                <div class="dropdown-divider"></div><a class="dropdown-item text-danger" href="#!">Remove</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body h-100 pr-0">
                            <div class="echart-line-total-sales h-100" data-echart-responsive="true">
                            <Line data={noofusers} width={500} height={250} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContentBox>
    )
}

export default Dashboard