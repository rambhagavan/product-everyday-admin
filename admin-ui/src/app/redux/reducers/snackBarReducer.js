import { HIDE_SNACKBAR, SHOW_SNACKBAR } from "../constant"

const initialState = {
    show: false,
    msg: "",
    type: "success"
}

export const snackBarStateData = (snackBarState = initialState, action) => {
    switch (action.type) {
        case SHOW_SNACKBAR:
            console.log("SHOW here",action.payload)
            snackBarState = {
                show:true,
                msg:action.payload.msg,
                type:action.payload.type
            }
            return snackBarState
        case HIDE_SNACKBAR:
            console.log("HIDE here",action.payload)
            snackBarState= {
                show: false,
                msg: "",
                type: "success"
            }
            return snackBarState
        default:
            return snackBarState
    }
}