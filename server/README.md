# Product Everyday Backend Server
This repository contains server side code for product everyday

## Code Prerequisites
* Node js v18.18.0
* Docker version 24.0.6

## Folder Structure
    server
    ├── app
    │   ├── app.js
    │   ├── constants
    │   │   └── index.js
    │   ├── controllers
    │   │   ├── address.js
    │   │   ├── auth.js
    │   │   ├── brand.js
    │   │   ├── category.js
    │   │   ├── coupan.js
    │   │   ├── enquiry.js
    │   │   ├── product.js
    │   │   ├── razorpay.js
    │   │   ├── restaurantItem.js
    │   │   ├── restaurant.js
    │   │   ├── upload.js
    │   │   └── user.js
    │   ├── core
    │   │   ├── configs.js
    │   │   ├── exceptions.js
    │   │   ├── logger
    │   │   │   └── index.js
    │   │   ├── passport.js
    │   │   ├── response.js
    │   │   └── template.js
    │   ├── middleware
    │   │   ├── auth.js
    │   │   ├── cors.js
    │   │   ├── db.js
    │   │   ├── role.js
    │   │   └── upload.js
    │   ├── models
    │   │   ├── address.js
    │   │   ├── brand.js
    │   │   ├── category.js
    │   │   ├── coupan.js
    │   │   ├── enquiry.js
    │   │   ├── order.js
    │   │   ├── product.js
    │   │   ├── restaurantItem.js
    │   │   ├── restaurant.js
    │   │   └── user.js
    │   ├── public
    │   │   └── images
    │   │       └── products
    │   ├── resources
    │   │   └── static
    │   │       └── swagger.yaml
    │   ├── routes
    │   │   ├── api
    │   │   │   ├── address.js
    │   │   │   ├── auth.js
    │   │   │   ├── brand.js
    │   │   │   ├── category.js
    │   │   │   ├── coupan.js
    │   │   │   ├── enquiry.js
    │   │   │   ├── index.js
    │   │   │   ├── product.js
    │   │   │   ├── razorpay.js
    │   │   │   ├── restaurantItem.js
    │   │   │   ├── restaurantItem_old.js
    │   │   │   ├── restaurant.js
    │   │   │   ├── upload.js
    │   │   │   └── user.js
    │   │   └── index.js
    │   ├── services
    │   │   └── email.js
    │   └── utils
    │       ├── cloudinary.js
    │       ├── db.js
    │       ├── queries.js
    │       ├── seed.js
    │       ├── store.js
    │       ├── tax.js
    │       └── utils.js
    ├── Dockerfile
    ├── index.js
    ├── nodemon.json
    ├── package.json
    ├── package-lock.json
    └── README.md


## Steps To build docker image and running the container
1. docker build -t ped-server .
2. docker run -p 6080:6080 -d ped-server


