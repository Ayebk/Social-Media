//components
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";
import Post from "../../components/post/Post";
import Rightbar from "../../components/rightbar/Rightbar";

import { React, useEffect, useState } from "react";

import {  useHistory, useParams } from "react-router-dom";

//material ui
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { Button,  Grid, makeStyles } from "@material-ui/core";

import Modal from 'react-modal';

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setPosts } from "../../redux/actions/postActions";
import { returnErrors } from "../../redux/actions/errorActions";

import axios from "axios"
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


  container: {
    backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
    overflow:"hidden",

    
    justifyContent: "center",

    [theme.breakpoints.down("400")]: {
      display: "inline-block",
    },
  },
  left: {
    marginLeft: "48px",
    [theme.breakpoints.down("1100")]: {
      marginRight: "1px",
    },
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
  wrapperMap:{
    width: "208px", height: "132px",
    [theme.breakpoints.down("715")]: {
      width: "100%", height: "auto",
      textAlign: "-webkit-center",
      display: "contents"
    },


  },
  cardwarp: {
    margin: "10px"

  },
  cardroot: {
    display: 'flex',
    width: "208px",
    height: "140px",cursor: "pointer",
    [theme.breakpoints.down("715")]: {
    width: "208px",
    height: "80px",
    },
    [theme.breakpoints.down("460")]: {
      width: "140px",
      height: "80px",
    },
    
  },
  carddetails: {
    height: "140px",
    
    
   
  
    


  },
  cardcontent: {
    width: "123px",
    textOverflow: "ellipsis",
    height: "130px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: " -webkit-box",
    " -webkit-line-clamp": " 4",
    "-webkit-box-orient": "vertical",
    [theme.breakpoints.down("460")]: {
      
  
      display: " -webkit-box",
      " -webkit-line-clamp": " 2",
      "-webkit-box-orient": "vertical"
    },

  },
  cardcover: {
    width: "90px",
    [theme.breakpoints.down("460")]: {
      display:"none"
    },
  },
  cardPost: {
    width: "57%",
    marginBottom: "30px"
  },
  titlesCard:{
    fontSize: "25px",
    fontWeight: "400",
    [theme.breakpoints.down("460")]: {
      fontSize: "22px",
      fontWeight: "600",
    },
  }



}));



export default function Category() {

  const posts = useSelector((state) => state.allPosts.posts);

  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]) 

  const [first, setFirst] = useState(5) // for fetching every 5 posts
  const [last, setLast] = useState(10) // for fetching every 5 posts

  const [postsContentNext, setpostsContentNext] = useState([])
  const [postsContentNextCategory, setpostsContentNextCategory] = useState([])
  const [CategoryPosts, setCategoryPosts] = useState([])
  const [finish, setFinish] = useState(false)
  const [trends, setTrends] = useState([])

  Modal.setAppElement('#root');



  useEffect(() => {

    axiosInstance.get("/post/", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
        dispatch(setPosts(resp.data.message))
        setLoading(false);
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.error(err);
      });
  }, [loading])


  useEffect(() => {
    axiosInstance.get("/category/all", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
        setCategories(resp.data.message)
        setLoading(false)
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.error(err);
      });
  }, [loading])


  useEffect(() => {
    axiosInstance.get('/post/getTrends')
      .then(res => {
        setLoading(false);

        setTrends(res.data.message)
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.log(err)
      })
  }, [loading])


  useEffect(() => {

    const HandlerCategory = async () => {
      const firstResponse = await Promise.all([
        axiosInstance.get("/post/category/" + id, {
          headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        })
          .then(resp => {
            setCategoryPosts(resp.data.message)
            setLoading(false);
          })
          .catch(err => {
            dispatch(returnErrors(err.response));
            console.error(err);
          })
      ]);


    }
    HandlerCategory();

  }, [id])


  const toCategory = (id) => {
    history.push("/category/" + id)
  }


  /**
   * fetching 5 posts every time (all categories)
   */

  const fetchMoreData = async () => {
    if (last < posts.length) {
      setFirst(first + 5);
      setLast(last + 5);
      setpostsContentNext(postsContentNext.concat((posts).slice(first, last)))
    } else {

      setFirst(posts.length - first);
      setLast(posts.length);

      setpostsContentNext(postsContentNext.concat((posts).slice(first, last)))
      setFirst(posts.length);
      setLast(posts.length + 1);
      setFinish(true)

    }

  }


 /**
   * fetching 5 posts every time (for every category)
   */

  const fetchMoreDataCategory = async () => {
    axiosInstance.get("/post/category/" + id, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
  


        if (last < posts.length) {
          setFirst(first + 5);
          setLast(last + 5);
          setpostsContentNextCategory(postsContentNextCategory?.concat((resp.data.message)?.slice(first, last)))
      
        } else {

          setFirst(posts.length - first);
          setLast(posts.length);

          setpostsContentNextCategory(postsContentNextCategory?.concat((resp.data.message)?.slice(first, last)))
          setFirst(posts.length);
          setLast(posts.length + 1);
         
          setFinish(true)


        }

      })

  }



  const ShowPosts = () => {

    return (
      <div id="postShare">
        <div id="postWrapper"  >
          {id == "all" ? (
            <div style={{ textAlign: "-webkit-center" }}>
              {postsContentNext.map(p => ((
                <div >
                  <Post post={p} key={p.id} loading={loading} style={{ width: "55%", textAlign: "-webkit-center" }} />
                </div>
              )))}
                 {loading || finish ? "" : <Button variant="contained" color="secondary" onClick={fetchMoreData} style={{marginBottom:"50px"}} >
          Show more
        </Button>}
            </div>
          )
            :
            (
              <div style={{ textAlign: "-webkit-center" }}>
                <div>
                  {postsContentNextCategory?.map(p => ((
                    <div >
                      <Post post={p} key={p.id} loading={loading} />
                    </div>
                  )))}
                          {loading || finish ? "" : <Button variant="contained" color="secondary" onClick={fetchMoreDataCategory} style={{marginBottom:"50px"}} >
          Show more
        </Button>}
                </div>

              </div>
            )
          }
        </div >
      </div >
    )
  }



  const ShowFirstPosts = () => {
    return (
      <div id="postShare">
        <div id="postWrapper"  >
          <h1 style={{ textAlign: "center", marginBottom: "10px", marginTop: "30px" }}> Explore </h1>
          {id == "all" && loading == false ? (
            <div style={{ textAlign: "-webkit-center" }}>
              {posts.slice(0, 5).map((item, index) => (
                <div key={index} >
                  <Post post={item} key={item.id} id={id} loading={loading} style={{ textAlign: "-webkit-center" }} />
                </div>
              ))}
            </div>
          )
            :
            (
              <div style={{ textAlign: "-webkit-center" }}>
                {CategoryPosts.slice(0, 5).map((item, index) => (
                  <div key={index} >
                    <Post post={item} key={item.id} loading={loading} style={{  textAlign: "-webkit-center" }} />
                  </div>
                ))}

              </div>
            )
          }
        </div >
      </div >

    )

  }


  return (
    <div>
      <Topbar />
      <Grid container className={classes.container} container
      >
        <Grid item xs={2} sm={1} lg={1} className={classes.left} container spacing={10} >
          <Leftbar />
        </Grid>
        <Grid item sm={8} md={6} lg={5} className={classes.center}>
          <div style={{ marginTop: 100 }}>

            <h2 style={{ textAlign: "center", marginBottom: "10px" }}> Top Categories</h2>
            <div className={classes.wrapper}>
              {(loading ? Array.from(new Array(6)) : categories).map((item, index) => (
                <div key={index} className={classes.wrapperMap} style={{ marginRight: "30px", marginTop: "35px" }}>
                  {item ? (
                    <div className={classes.cardwarp}>
                      <Card key={index} className={classes.cardroot} onClick={() => toCategory(item._id)}>
                        <div className={classes.carddetails}>
                          <CardContent className={classes.cardcontent}>
                            <Typography  className={classes.titlesCard}>
                              {item.title}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                              {item.description}
                            </Typography>
                          </CardContent>
                        </div>
                        <CardMedia
                          className={classes.cardcover}
                          image={item.img}
                        />
                      </Card>
                    </div>
                  ) : (
                    <Skeleton animation="wave" variant="rect" width={210} height={118} />
                  )}
                </div>
              ))}
            </div>
            {ShowFirstPosts()}
            {ShowPosts()}
          </div>
        </Grid>
        <Grid item sm={2} md={1} lg={2} className={classes.right}>
          <Rightbar />
        </Grid>
      </Grid>
    </div>
  )
}
