import React, { useState } from 'react'
import axios from 'axios'
import { showSnackBar } from '../../redux/actions/snackBarActions';
import { useDispatch } from 'react-redux';
import { BACKEND_URL, RAZORPAY_API_KEY } from '../../core/constants';
import Spinner from '../../components/Spinner/Spinner';
import { ContentBox } from '../../styles/AppStyles';
import TopSpinner from '../../components/Spinner/TopSpinner';

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

const PaymentCreate = () => {
    const order= {
        shipping_charge:30,
    }
    const [loading, setloading] = useState(false)
    const dispatch = useDispatch()

    async function displayRazorpay() {
        setloading(true)
        console.log(RAZORPAY_API_KEY)
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        //Creating RazorPay Order
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const data = {
            "amount": Number(order.shipping_charge ? order.shipping_charge : 50) * 100,
            "receipt": "string",
            "notes": {}
        }
        const body = JSON.stringify(data);
        let razorpay_order_id = ''
        try {
            console.log(`${BACKEND_URL}/razorpay/order/create`)
            const res = await axios.post(`${BACKEND_URL}/razorpay/order/create`, body, config);
            razorpay_order_id = res.data.id
        } catch (err) {
            return
        }

        const options = {
            key: RAZORPAY_API_KEY, // Enter the Key ID generated from the Dashboard
            amount: 5000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Product Everyday India Pvt. Ltd.",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: razorpay_order_id,
            handler: function (response) {
                dispatch(showSnackBar({ msg: "Payment Successfull", type: "success" }))
            },
            prefill: {
                name: "Product Everyday",
                email: "producteveryday@gmail.com",
                contact: "9399345678"
            },
            notes: {
                address: "Bengaluru"
            },
            theme: {
                color: "#5157F0"
            }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.on('payment.failed', function (response) {
            dispatch(showSnackBar({ msg: "Payment Failed", type: "error" }))
        });
        paymentObject.open()
        setloading(false)
    }

    return (
        <ContentBox>
            <button type="button" class="btn btn-sm bg-blue" onClick={displayRazorpay}>Create a Payment</button>
            <TopSpinner open={loading}/>
        </ContentBox>
    )
}

export default PaymentCreate