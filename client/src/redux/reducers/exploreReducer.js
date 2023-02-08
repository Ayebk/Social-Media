import { ActionTypes } from "../contants/action-types"

const initialState = {
    explore: false,
    
}




export const explore = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.EXPLORE:
            return { 
                ...state, 
                explore: true };
      
        default:
            return state;
    }

}

export const unexplore = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.EXPLORE:
            return { 
                ...state, 
                explore: false };
      
        default:
            return state;
    }

}





