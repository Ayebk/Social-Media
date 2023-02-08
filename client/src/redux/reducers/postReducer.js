import { ActionTypes } from "../contants/action-types"

const initialState = {
    posts: [{
    }]
}

export const postReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_POST:
            return { ...state, posts: payload };
        default:
            return state;
    }

}

export const postCategoryReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_CATERGORY_POST:
            return { ...state, posts: payload };
        default:
            return state;
    }

}



export const selectedPost = (state = {}, { type, payload }) => {
    switch (type) {

        case ActionTypes.SELECTED_POST:
            return { ...state, ...payload };
        case ActionTypes.REMOVE_SELECTED_POST:
            return {  };
        default:
            return state;
    }

}

export const createPost = (state = {}, { type, payload }) => {
    switch (type) {
        case ActionTypes.CREATE_POST:
            return { ...state, ...payload };
        default:
            return state;
    }

}



