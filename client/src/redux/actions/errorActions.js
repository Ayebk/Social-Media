import { ActionTypes } from "../contants/action-types"




//Auth Error
export const authError = (error) => {
    return {
        type: ActionTypes.AUTH_ERROR,
    };
};


// RETURN ERRORS
export const returnErrors = (error) => {
    return {
      type: ActionTypes.GET_ERRORS,
      payload: error
    };
  };
  
  // CLEAR ERRORS
  export const clearErrors = () => {
    return {
      type: ActionTypes.CLEAR_ERRORS
    };
  };