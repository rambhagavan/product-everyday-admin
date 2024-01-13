import axios from 'axios';
import { RESTAURANT_SERVICE_URL, headersConfig } from '../../core/constants'
import { generateGlobalHeader } from '../Common';

export const createUserRestaurant = async (payload) => {
    const url = `${RESTAURANT_SERVICE_URL}restaurant/create`
    const headersData = generateGlobalHeader()
    const body = payload
    console.log(url)
    const response = await axios.post(url, body, headersData)
        .then(res => { return res })
        .catch(err => { return err });
    const data = response?.data || []
    return data
}