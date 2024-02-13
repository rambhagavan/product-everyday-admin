import axios from 'axios';
import { BACKEND_URL, headersConfig } from '../../core/constants'


export const adminLoginService = async (credentials) => {
    const url = `${BACKEND_URL}/auth/login`
    const body = {
        'email': credentials.email,
        'password': credentials.password
    }
    console.log(url)
    const response = await axios.post(url, body, headersConfig)
        .then(res => { return res })
        .catch(err => { return err.response });
    const data = response?.data || null
    return data
}

export const adminRegisterService = async (credentials) => {
    const url = `${BACKEND_URL}/auth/register`
    const body = {
        'email': credentials.email,
        'password': credentials.password,
        'firstName': credentials.firstName,
        'lastName': credentials.lastName,
        'phone': credentials.phone,

    }
    console.log(url)
    const response = await axios.post(url, body, headersConfig)
        .then(res => { return res })
        .catch(err => { return err.response });
    const data = response?.data || null
    console.log(response)
    return data
}

export const adminGetAllUsers = async (token, bearer) => {
    const url = `${BACKEND_URL}/users/list`
    const headersData = {
        headers: {
            'bearer': token
        }
    }
    console.log(url)
    const response = await axios.get(url, headersData)
        .then(res => { return res })
        .catch(err => { return err.response });
    const data = response?.data || null
    return data
}

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
      const response = await axios.post("http://127.0.0.1:6080/api/auth/verify-email", {
        email,
        verificationToken,
      });
  
      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      // Handle errors
      console.error('Error sending verification email:', error.response.data);
      throw error;
    }
  };



