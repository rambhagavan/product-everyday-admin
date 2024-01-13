import { SHOW_SNACKBAR,HIDE_SNACKBAR } from "../constant"

export const showSnackBar = (payload) => {
    console.log("Snackbar",payload)
    return {
        type: SHOW_SNACKBAR,
        payload
    }
}

export const hideSnackBar = (payload) => {
    return {
        type: HIDE_SNACKBAR,
        payload
    }
}