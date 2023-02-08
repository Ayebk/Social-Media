import { ActionTypes } from "../contants/action-types"


//User Loading
export const loadingUser = () => {
    return {
        type: ActionTypes.USER_LOADING,
    };
};


//User Loaded
export const loadedUser = (user) => {
    return {
        type: ActionTypes.USER_LOADED,
        payload:user
    };
};


//Register Success
export const registerSuccess = (user) => {
    return {
        type: ActionTypes.REGISTER_SUCCESS,
    };
};


//Register Fail
export const registerFail = (user) => {
    return {
        type: ActionTypes.REGISTER_FAIL,
    };
};



//Login Success
export const loginSuccess = (user) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        payload:user
    };
};


//Login Fail
export const loginFail = (user) => {
    return {
        type: ActionTypes.LOGIN_FAIL,
    };
};


//Logout Success
export const logoutSuccess = (user) => {
    return {
        type: ActionTypes.LOGOUT_SUCCESS,
    };
};





