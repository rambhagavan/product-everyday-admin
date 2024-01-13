import {combineReducers} from 'redux'
import { snackBarStateData } from './snackBarReducer'
import { spinnerStateData } from './spinnerReducer'



export default combineReducers({
    spinnerStateData,
    snackBarStateData,
})