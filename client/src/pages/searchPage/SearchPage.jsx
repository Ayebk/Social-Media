//Components
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";

import { React, useEffect, useState } from "react";

//material ui
import { Grid, makeStyles, Typography } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ViewPost from "../../components/viewPost/ViewPost";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

//lottifiles
import animationLoading from '../../assets/lottiefiles/motion.json'
import Lottie from 'react-lottie-player'

import { Link, useHistory, useParams } from "react-router-dom";

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setPosts } from "../../redux/actions/postActions";
import { selectedPost, removeSelectedPost } from "../../redux/actions/postActions";
import { returnErrors } from "../../redux/actions/errorActions";

import Modal from 'react-modal';

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
  },
  rootUsers: {
    marginLeft: "2%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
  },
  sreachWindow: {
    marginTop: "15%",
    textAlign: "-webkit-center"

  },
  rootPosts: {
    height: 280,
    maxWidth: 345,
    display: "inline-flex",
    margin: "10px",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
  },
  media: {
    verticalAlign: "baseline",
    height: 140,
    width: 345

  },


}));


    /**
     * Modal styles
     * 
     */

const customStyles = {
  content: {
    height: '75%',
    width: '70%',
    top: '15%',
    left: '15%',

  },
};

Modal.setAppElement('#root');


export default function SearchPage() {

  const posts = useSelector((state) => state.allPosts.posts);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { text } = useParams();
  const loggedUser = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([])
  const history = useHistory()
  const [refresh, setRefresh] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [postShare, setPostShare] = useState();
  const [loadingShare, setLoadingShare] = useState(true)
  const [trends, setTrends] = useState([])
  var path = require('path')

  const PostId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)


    /**
     * Modal
     * 
     */

  function openModal(post) {
    dispatch(selectedPost(post))

    setIsOpen(true);
  }

  function afterOpenModal() {
  }

  function closeModal() {
    setRefresh(true)
    setIsOpen(false);

  }




  useEffect(() => {
    axiosInstance.get("/post/search/" + text, {
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
    axiosInstance.get('/users/search/' + text, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
        setUsers(resp.data.message)
        setLoading(false);
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
    const FindForShare = () => {
      axiosInstance.get("/post/search/exact/" + PostId, {
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      })
        .then(resp => {
          setPostShare(resp.data.message)
          console.log(resp.data.message)
          setLoadingShare(false)
        })
        .catch(err => {
          dispatch(returnErrors(err.response));
          console.error(err);
        });
    }
    if (text == 'exactShare') {
      FindForShare();
    }
  }, [loading])






  function userProfile(userId) {
    history.push(`/profile/` + userId);
  }


  const ShowPosts = () => {
    return (
      <div id="postShare">
        <div id="postWrapper"  >
          {loading ?

            <div  >
              <Lottie className={classes.animation}
                loop
                animationData={animationLoading}
                play
                style={{ width: 120, height: 120, marginLeft: "45%" }}
              />
            </div>
            :
            <div className={classes.sreachWindow} >
              <hr />
              <h3>Posts</h3>
              <hr />
              {
                posts.map((p,index) => ((
                  <div key={index}>
                    <Link to={"/searchpage/" + text} onClick={() => openModal(p)} style={{ textDecoration: "none" }}>

                      <Card className={classes.rootPosts}>
                        <CardActionArea>

                       {(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(p.img)))) ? (

                        <div>
                          
                                <CardMedia 
                                    component='img'
                                    className={classes.media}
                                    src={p.img}
                                />
                        </div>


                    ) : (

                        <div>
                            <CardMedia 
                                component='video'
                                className={classes.media}
                                src={p.img}
                                controls
                            />
                        </div>
                    )}
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                              {p.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              {p.description}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Link>

                    <Modal
                      isOpen={modalIsOpen}
                      onAfterOpen={afterOpenModal}
                      onRequestClose={closeModal}
                      style={customStyles}
                      contentLabel="Example Modal"
                    >
                      <HighlightOffIcon fontSize='large' onClick={closeModal} style={{ float: "right", cursor: "pointer" }} />
                      <ViewPost postId={p._id} key={p.id} />

                    </Modal>
                  </div>
                )))
              }
              <hr />
              <h3>Users</h3>
              <hr />
              {
                users.map(u => ((
                  <List className={classes.rootUsers}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={u.img} onClick={() => userProfile(u._id)} style={{ cursor: "pointer" }} />
                      </ListItemAvatar>
                      <ListItemText primary={u.username} />
                    </ListItem>
                  </List>
                )))
              }
            </div>
          }
        </div>
      </div>
    )
  }



  const ShowPostsForShare = () => {

    return (
      <div id="postShare">
        <div id="postWrapper"  >
          {loadingShare ? <h3>loading</h3>
            :

            <div className={classes.sreachWindow} >
              <hr />
              <h3>Posts</h3>
              <hr />
              {
                <div>
                  <Link to={"/searchpage/" + text} onClick={() => openModal(postShare)} style={{ textDecoration: "none" }}>
                    <Card className={classes.rootPosts}>
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={postShare.img}
                          title={postShare.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {postShare.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {postShare.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>

                  <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <HighlightOffIcon fontSize='large' onClick={closeModal} style={{ float: "right", cursor: "pointer" }} />
                    <ViewPost postId={postShare._id} key={postShare.id} />

                  </Modal>
                </div>
              }
            </div>
          }
        </div>
      </div>
    )
  }



  return (
    
      <div className={classes.page}>
      <Topbar />
      <Grid container className={classes.container} container>
        <Grid item xs={2} sm={1} lg={1} className={classes.left} container spacing={10} >
          <Leftbar />
        </Grid>
        <Grid item sm={9} md={7} lg={6} className={classes.center}>
          <div style={{ marginTop: 80 }}></div>
          {text != 'exactShare' ?
            ShowPosts()
            :
            ShowPostsForShare()
          }
        </Grid>
        <Grid item sm={1} md={1} lg={1} className={classes.right} container spacing={10}>
        </Grid>
      </Grid>
    </div>
  )
}
