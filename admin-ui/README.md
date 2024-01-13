# Product Everyday Backend Server
This repository contains server side code for product everyday

## Code Prerequisites
* Node js v18.18.0
* Docker version 24.0.6

## Code Structure
    src/
    └── app
        ├── auth
        ├── components
        │   ├── AppLayout
        │   │   └── Layout
        │   ├── AppTheme
        │   ├── Buttons
        │   ├── Common
        │   ├── Core
        │   ├── DataTables
        │   ├── Dialogs
        │   ├── Icons
        │   ├── Loader
        │   ├── Modal
        │   ├── NotificationBar
        │   ├── SecondarySidebar
        │   ├── SideBar
        │   ├── SnackBar
        │   └── Spinner
        ├── context
        ├── core
        ├── hooks
        ├── pages
        │   ├── 403AccessForbidden
        │   ├── 404NotFound
        │   ├── Authentication
        │   │   └── services
        │   ├── Brand
        │   │   └── components
        │   ├── Category
        │   │   └── components
        │   ├── Dashboard
        │   ├── DummyTest
        │   ├── Landing
        │   ├── Orders
        │   ├── Payments
        │   ├── Product
        │   │   └── components
        │   ├── Restaurant
        │   │   └── components
        │   ├── Search
        │   ├── Simulation
        │   │   └── SimulationAgents
        │   └── User
        │       └── components
        ├── redux
        │   ├── actions
        │   ├── reducers
        │   ├── sagas
        │   ├── services
        │   └── stores
        ├── route
        ├── services
        │   ├── Auth
        │   ├── Payment
        │   ├── Product
        │   └── Restaurant
        └── styles

## Steps To build docker image and running the container
1. docker build -t ped-admin-ui .
2. docker run -p 6080:6080 -d ped-admin-ui
