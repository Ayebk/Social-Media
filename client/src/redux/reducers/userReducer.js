import { ActionTypes } from "../contants/action-types"

const initialState = {
    user: {
    }
}




export const selectedUser = (state = initialState, { type, payload }) => {
    switch (type) {

        case ActionTypes.SELECTED_USER:
            return { ...state, ...payload };
        case ActionTypes.REMOVE_SELECTED_USER:
            return {  };
        default:
            return state;
    }

}

export const fellowUser = (state = {}, { type, payload }) => {
    switch (type) {
        case ActionTypes.FOLLOW_USER:
            return { ...state, ...payload };
        case ActionTypes.UNFOLLOW_USER:
            return { ...state, ...payload };
        default:
            return state;
    }

}



