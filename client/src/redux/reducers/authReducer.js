import { ActionTypes } from "../contants/action-types"

const initialState = {
    token: localStorage.getItem('token'),
    isLoading: false,
    user: localStorage.getItem('user'),
}




export const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.USER_LOADING:
            return { 
                ...state, 
                isLoading: true };
        case ActionTypes.USER_LOADED:
            return { 
                ...state, 
                isLoading:false, 
                user: payload };
        case ActionTypes.LOGIN_SUCCESS:
        case ActionTypes.REGISTER_SUCCESS:
            return { 
                ...state,
                ...payload, 
                isLoading:false, 
                };
        case ActionTypes.AUTH_ERROR:
        case ActionTypes.LOGIN_FAIL:
        case ActionTypes.LOGOUT_SUCCESS:
        case ActionTypes.REGISTER_FAIL:
            return { 
                ...state,
                token: localStorage.removeItem('token'),
                user:localStorage.removeItem('user'),
                isLoading:false,
                _id:null,
                username:null,
                email:null,
                img:null
                };
        default:
            return state;
    }

}





