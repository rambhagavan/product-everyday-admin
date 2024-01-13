import axios from 'axios';
import { headersConfig, BACKEND_URL } from '../../core/Constants';


export const someService = async (params) => {
    let url = `${BACKEND_URL}someapi/`
    const response = await axios.get(url, headersConfig)
        .then(res => { return res })
        .catch(err => { return err });
    return response?.data || []
}