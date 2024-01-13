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
