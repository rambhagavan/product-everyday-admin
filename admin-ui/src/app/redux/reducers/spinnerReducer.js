import { SET_SPINNER_FALSE, SET_SPINNER_TRUE } from "../constant"

export const spinnerStateData = (spinnerState = false, action) => {
    switch (action.type) {
        case SET_SPINNER_FALSE:
            return false
        case SET_SPINNER_TRUE:
            return true
        default:
            return spinnerState
    }
}