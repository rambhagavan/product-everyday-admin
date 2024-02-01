import { ADD_CATEGORY_LIST } from "../constant"

const initialState = {
    
    categoryList : [],
    
}

export const categoryListDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CATEGORY_LIST:
            console.log("category List",action.payload)
            
            return {
                ...state,
                categoryList: action.payload 
                 
            }
        default:
            return state
    }
}

export default categoryListDataReducer;