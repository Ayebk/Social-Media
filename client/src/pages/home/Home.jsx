//components
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";
import Post from "../../components/post/Post";
import Share from "../../components/share/Share";
import Rightbar from "../../components/rightbar/Rightbar";

import { React, useEffect, useState } from "react";

//material ui
import { Button, Grid, makeStyles } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Explore } from "@material-ui/icons";

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setPosts } from "../../redux/actions/postActions";
import { returnErrors } from "../../redux/actions/errorActions";

import { useHistory } from "react-router-dom";

import { axiosInstance } from "../../config";



/**
 * Matrail ui Components Styles
 */

const useStyles = makeStyles((theme) => ({


  "@global": {
    "*::-webkit-scrollbar": {
      width: "2px"
    },

    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#ff0505",
      outline: "1px solid #ff0505"
    },
  },

  page:{
  },
  container: {
    height: "100vh",
    backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",

    justifyContent: "center",
    overflow:"scroll",

    [theme.breakpoints.down("400")]: {
      display: "inline-block",
    },
  },
  left: {
    marginLeft: "48px",
    [theme.breakpoints.down("850")]: {
      display: "none",
    },
  },
  right: {
    [theme.breakpoints.down("1200")]: {
      display: "none",
    },
  },
  post: {
    marginBottom: 5
  },
  wrapper: {
    display: "inline-flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "stretch",
    justifyContent: "center",
  },
  cardwarp: {
    margin: "10px"

  },
  cardroot: {
    display: 'flex',
    width: "208px",
    height: "132px"
  },
  carddetails: {
    height: "120px",
    textOverflow: "ellipsis",

  },
  cardcontent: {
    width: "123px",
    textOverflow: "ellipsis",
    height: "120px"

  },
  cardcover: {
    width: "123px",
  },
  divTour: {
    textAlign: "center"
  },
  ButtonTour: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    marginLeft: theme.spacing(0),
    fontWeight: 500,
    fontSize: "26px",

  }

}));

export default function Home() {

  const dispatch = useDispatch();
  const classes = useStyles();
  const loggedUser = useSelector((state) => state.auth);
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [followersPosts, setFollowersPosts] = useState([]) //// change after that to redux.. !!!////
  const [categories, setCategories] = useState([]) //// change after that to redux.. !!!////
  const [first, setFirst] = useState(5)
  const [last, setLast] = useState(10)
  const [finish, setFinish] = useState(false)
  const [postsContentNext, setpostsContentNext] = useState([])
  const [trends, setTrends] = useState([])





  useEffect(() => {
  
    if(!localStorage.getItem("token")){
      history.push(`/category/all`);
      history.go()
    }

    axiosInstance.get("/post/", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
        dispatch(setPosts(resp.data.message))
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.error(err);
      });
  }, [loading])




  useEffect(() => {
    axiosInstance.get("/post/followers/" + loggedUser.user, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
        setFollowersPosts(resp.data)
        setLoading(false)
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.error(err);
      });
  }, [loading])



  useEffect(() => {
    axiosInstance.get("category/all", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
        setCategories(resp.data.message)
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.error(err);
      });
  }, [loading])



  useEffect(() => {
    axiosInstance.get('/post/getTrends')
      .then(res => {

        setTrends(res.data.message)
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.log(err)
      })
  }, [loading])



/**
   * fetching 5 posts at time
   */


  const fetchMoreData = async () => {
    console.log(first)
    console.log(last)
    console.log(followersPosts.length)

    if (last < followersPosts.length) {

      setFirst(first + 5);
      setLast(last + 5);
      setpostsContentNext(postsContentNext.concat((followersPosts).slice(first, last)))


    } else {

      setFirst(followersPosts.length - first);
      setLast(followersPosts.length);

      setpostsContentNext(postsContentNext.concat((followersPosts).slice(first, last)))
      setFirst(followersPosts.length);
      setLast(followersPosts.length + 1);

      setFinish(true)
    }
  }





  const ShowFirstMyFolloweresPosts = () => {

    return (
      <div id="postShare">
        <div className={classes.postWrapper}  >
          {followersPosts.slice(0, 5).map((p, index) => ((                  
            <div key={index}>     
              <Post post={p} key={index} loading={loading}  />
            </div> 
          )))}
        </div>
      </div>
    )
  }



  const ShowMyFolloweresPosts = () => {

    return (
      <div style={{ textAlign: "-webkit-center" }}>
        {postsContentNext.map((p, index) => ((
          <div key={index}>
            <Post post={p} key={p.id} loading={loading} />
          </div>
        )))}
        {loading || finish ? "" : <Button variant="contained" color="secondary" onClick={fetchMoreData} style={{marginBottom:"50px"}} >
          Show more
        </Button>}
      </div>
    )
  }



  const toExplore = () => {
    history.push(`/category/all`);
    history.go()

  }


  return (
    <div className={classes.page}>
      <Topbar />
      <Grid container className={classes.container} container>
        <Grid item xs={2} sm={1} lg={1} className={classes.left} container spacing={10} >
          <Leftbar />
        </Grid>
        <Grid item sm={8} md={6} lg={5} className={classes.center}>
          <div style={{ marginTop: 100 }}></div>
          <div>
            <Share />
            {followersPosts.length == 0 && loading == false ?
              <div className={classes.divTour} >
                <h2 style={{ fontFamily: 'Roboto', fontWeight: "400", fontSize: "27px", marginTop: "50px" }}> It Seems You are New here</h2>
                <h2 style={{ fontFamily: 'Roboto', fontWeight: "400", fontSize: "25px", marginTop: "11px", marginBottom: "8px" }}> Follow people so this page will filled with Posts</h2>
                <div className={classes.ButtonTour}>
                  <IconButton className={classes.IconButton} color="inherit" variant="outlined" style={{ borderBlockColor: "black", borderRadius: "13px", justifyContent: "flex-start" }} onClick={() => toExplore()} >
                    <Explore className={classes.icon} style={{ fontSize: 55, color: "#0f0f9c" }} ></Explore>
                    <Typography className={classes.text}> Explore </Typography>
                  </IconButton>
                </div>
              </div>
              :
              <div>
                {ShowFirstMyFolloweresPosts()}
                {ShowMyFolloweresPosts()}
              </div>
            }
          </div>
        </Grid>
        <Grid item sm={2} md={2} lg={2} className={classes.right} container spacing={10}>
          <Rightbar />
        </Grid>
      </Grid>
    </div>
  )
}
