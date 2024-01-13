import axios from 'axios';
import { PAYMENT_SERVICE_URL, headersConfig } from '../../core/constants'
import { generateGlobalHeader } from '../Common';

export const createpayment = async (payload) => {
    const url = `${PAYMENT_SERVICE_URL}restaurant/create`
    const headersData = generateGlobalHeader()
    const body = payload
    console.log(url)
    const response = await axios.post(url, body, headersData)
        .then(res => { return res })
        .catch(err => { return err });
    const data = response?.data || []
    return data
}