import { SET_SPINNER_FALSE,SET_SPINNER_TRUE } from "../constant"

export const startSpinner = () => {
    return {
        type: SET_SPINNER_TRUE
    }
}

export const stopSpinner = () => {
    return {
        type: SET_SPINNER_FALSE
    }
}