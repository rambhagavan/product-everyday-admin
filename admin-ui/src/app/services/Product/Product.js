import axios from 'axios';
import { PRODUCT_SERVICE_URL, headersConfig } from '../../core/constants'
import { generateGlobalHeader } from '../Common';

export const createProduct = async (payload) => {
    const url = `${PRODUCT_SERVICE_URL}product/add`
    const headersData = generateGlobalHeader()
    const body = payload
    console.log(url)
    const response = await axios.post(url, body, headersData)
        .then(res => { return res })
        .catch(err => { return err });
    const data = response?.data || []
    return data
}

export const fetchAllProduct = async (sortOrder=false,page=1,limit=10) => {
    const url = `${PRODUCT_SERVICE_URL}product/list/?sortOrder=${sortOrder}&page=${page}&limit=${limit}`
    const headersData = generateGlobalHeader()
    console.log(url)
    const response = await axios.get(url, headersData)
        .then(res => { return res })
        .catch(err => { return err });
    const data = response?.data || []
    return data
}