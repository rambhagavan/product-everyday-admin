import {ADD_CATEGORY_LIST } from "../constant"

export const addCategoryList = (data) => {
    return {
        type: ADD_CATEGORY_LIST,
        payload:data
    }
}
