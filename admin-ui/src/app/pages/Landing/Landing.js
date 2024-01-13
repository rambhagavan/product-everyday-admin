import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { headersConfig } from '../../core/Constants';
import Snackbar from '../../components/common/Snackbar';
import Spinner from '../../components/common/Spinner';
import styled from 'styled-components';

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

import { Bar } from 'react-chartjs-2';
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

const OptionBox = styled.div`
    background: #546e7a;
    color: #686b78;
    height:300px;
    width:auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;
`;

const Landing = () => {
  const [alert, setalert] = useState({
    show: false,
    msg: "",
    type: "alert-success"
  })
  const [spinner, setspinner] = useState(false)

  const showAlert = (msg, alert_type) => {
    setalert({
      show: true,
      msg: msg,
      type: alert_type
    })


    setTimeout(() => {
      setalert({
        show: false,
        msg: "",
        type: "alert-success"
      })
    }, 3000);

  }

  const templateFunction = async () => {
    setspinner(true)
    let data = []

    if (data.length == 0) {
      showAlert(`Some thing`, "alert-danger")
      setspinner(false)
    }


    setspinner(false)

  }

  useEffect(() => {

  }, [])

  return (
    <div className='bg-pink'>
      <div className='container-fluid bg-gray'>
        <div className='row p-5'>
          <div className='col-xl-3'>
            <img height={300} width={300} src='./assets/img/options/option1.jpg'></img>
          </div>
          <div className='col-xl-3'>
            <img height={300} width={300} src='./assets/img/options/option2.jpg'></img>
          </div>          <div className='col-xl-3'>
            <img height={300} width={300} src='./assets/img/options/option3.jpg'></img>
          </div>          <div className='col-xl-3'>
            <img height={300} width={300} src='./assets/img/options/option4.jpg'></img>
          </div>
        </div>
      </div>
      <div className='container-fluid'>
        <div className='row p-5 justify-content-center'>
          <div className='col-xl-2'>
            <img height={250} width={250} src='./assets/img/options/option4.jpg'></img>
          </div>
          <div className='col-xl-2'>
            <img height={250} width={250} src='./assets/img/options/option3.jpg'></img>
          </div>
          <div className='col-xl-2'>
            <img height={250} width={250} src='./assets/img/options/option1.jpg'></img>
          </div>
          <div className='col-xl-2'>
            <img height={250} width={250} src='./assets/img/options/option2.jpg'></img>
          </div>

        </div>
        </div>
    </div>
  )
}

export default Landing