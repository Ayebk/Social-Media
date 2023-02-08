import { combineReducers} from 'redux';
import { postReducer, postCategoryReducer, selectedPost , createPost } from "./postReducer";
import { selectedUser, fellowUser } from "./userReducer";
import { errors } from "./errorReducer";
import { authReducer } from "./authReducer";
import { explore } from "./exploreReducer";



const allReducers = combineReducers({
    //Post
    allPosts: postReducer,
    CategoryPosts: postCategoryReducer,
    post: selectedPost,
    createPost: createPost,
    //User
    selectedUser,
    fellowUser,
    //Error
    errors,
    //Auth
    auth: authReducer,
    //explore
    explore,
    




})

export default allReducers
