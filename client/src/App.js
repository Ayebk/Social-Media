
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import Register from "./pages/register/Register"
import Login from "./pages/login/Login"
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import ViewPost from "./components/viewPost/ViewPost"
import SearchPage from "./pages/searchPage/SearchPage"
import Categories from "./pages/category/category"
import Reset from "./pages/reset/Reset"
import Newpassword from "./pages/newPassword/NewPassword"
import NotFound from './pages/notFound/NotFound';


const dotenv = require('dotenv');


dotenv.config();



function App() {



  return (

    <Router>
      <Switch >
        <Route exact path={["/","/post/:id"]}>
          <Home />
        </Route>
        <Route  path="/user/register">
          <Register />
        </Route>
        <Route path="/profile/:id">
          <Profile />
        </Route>
        <Route   path="/user/login">
          <Login />
        </Route>
        <Route path="/post/:id">
          <ViewPost />
        </Route>
        <Route path="/searchPage/:text">
          <SearchPage />
        </Route>
        <Route path="/category/:id">
          <Categories />
        </Route>
        <Route exact path="/reset/">
          <Reset />
        </Route>
        <Route path="/reset/:token">
          <Newpassword />
        </Route>
        <Route >
          <NotFound />
        </Route>


      </Switch>
      <ToastContainer
                position="top-right"
                hideProgressBar={true}
                autoClose={false}
                newestOnTop={true}
                closeOnClick={false}
                draggable={false}
                rtl={false}
            />

    </Router>
  );
}

export default App;
