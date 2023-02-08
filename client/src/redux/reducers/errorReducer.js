import { ActionTypes } from "../contants/action-types"

const initialState = {
    data: {},
    status: null,
    id:null
   
}



export const errors = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.GET_ERRORS:
            return { 
                data:payload.data,
                status:payload.status,
                id:payload.id
            };
        case ActionTypes.CLEAR_ERRORS:
            return { 
                data:{},
                status:null,
                id:null
             };
        default:
            return state;
    }

}





