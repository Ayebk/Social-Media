import { ActionTypes } from "../contants/action-types"



export const selectedUser = (user) => {
    return {
        type: ActionTypes.SELECTED_USER,
        payload: user,
    };
};

export const removeSelectedUser = (user) => {
    return {
        type: ActionTypes.REMOVE_SELECTED_USER,
    };
};

export const followUser = (user) => {
    return {
        type: ActionTypes.FOLLOW_USER,
        payload: user,
    };
};

export const unfollowUser = (user) => {
    return {
        type: ActionTypes.UNFOLLOW_USER,
        payload: user,
    };
};



