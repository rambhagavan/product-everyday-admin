import {combineReducers} from 'redux'
import { snackBarStateData } from './snackBarReducer'
import { spinnerStateData } from './spinnerReducer'
import {categoryListDataReducer} from './categoryListDataReducer'



export default combineReducers({
    spinnerStateData,
    snackBarStateData,
    categoryListDataReducer,
})