import { ActionTypes } from "../contants/action-types"

export const setPosts = (posts) => {
    return {
        type: ActionTypes.SET_POST,
        payload: posts,
    };
};

export const setCatergoryPosts = (catergoryPosts) => {
    return {
        type: ActionTypes.SET_CATERGORY_POST,
        payload: catergoryPosts,
    };
};



export const selectedPost = (post) => {
    return {
        type: ActionTypes.SELECTED_POST,
        payload: post,
    };
};

export const removeSelectedPost = (post) => {
    return {
        type: ActionTypes.REMOVE_SELECTED_POST,
    };
};


export const createPost = (post) => {
    return {
        type: ActionTypes.CREATE_POST,
        payload: post,
    };
};