//components
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";
import MyPost from "../../components/post/MyPost";

import { useEffect, useState, Fragment } from "react";
import "./profile.css"

//material ui
import { Button, Grid, makeStyles } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";

//redux
import { returnErrors } from "../../redux/actions/errorActions";
import { removeSelectedUser, selectedUser } from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";

import { useHistory, useParams } from 'react-router-dom';

import { toast } from "react-toastify";

import axios from 'axios'
import { axiosInstance } from "../../config";



/**
 * Matrail ui Components Styles
 */


const useStyles = makeStyles((theme) => ({

  container: {
    height: "98vh",
    backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
    justifyContent: "center",
    overflow: "hidden",

    [theme.breakpoints.down("400")]: {
    },
  },
  left: {
    marginLeft: "195px",
    marginRight: "-20.5px",
    [theme.breakpoints.down("1280")]: {
      display: "none",
    },
  },
  imageList: {
    textAlign: "center",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  top: {
    height: "10vh",
    position: "sticky",
    top: 100,
    position: "sticky",

  },
  center: {
    marginLeft: "50px",
    [theme.breakpoints.down("1280")]: {
      marginLeft: "auto",
    },
  },
  imageListWrapper: {
    boxShadow: "1px 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06), 0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),0 100px 80px rgba(0, 0, 0, 0.40)",
    borderRadius: "5px",
    height: "65vh",
    overflow: "scroll",
    position: "sticky",
    width: "100%",
    alignItems: "center",
    flexWrap: "wrap",
    display: "inline-flex",
    marginTop: "65px",
    justifyContent: "space-evenly",
    justifyItems: "space",
    [theme.breakpoints.down("xs")]: {
    },
    [theme.breakpoints.down("1050")]: {
      marginTop: "140px",
    },
  },


}));

export default function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  let history = useHistory();
  const loggedUser = useSelector((state) => state.auth);
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [following, setFollowing] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [img, setImg] = useState()
  const [uploading, setUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState();


  /**
  * Notification
  */

  const notifyLogin = () => toast.info('You have to Login first !', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });


  useEffect(() => {
    fetchUser();
    return () => {
      dispatch(removeSelectedUser())
    }
  }, [loading, refresh])



  const fetchUser = async () => {
    const firstResponse = await Promise.all([
      await axiosInstance.get('/users/getuser/' + id)
        .then(res => {
          setUser(res.data);
          dispatch(selectedUser(user))
        }).catch(err => {
          console.log(err)
          dispatch(returnErrors(err.response));

        })

    ])

    await axiosInstance.get('/users/getuser/' + loggedUser.user)
      .then(res => {
        console.log(res)
        setFollowing(res.data.followings.includes(user?._id))
        console.log(following)
        setLoading(false);
      }).catch(err => {
        console.log(err)
        dispatch(returnErrors(err.response));
      })
  }




  useEffect(() => {
    const UploadImg = async () => {
      setUploading(true)
      const data = new FormData();
      data.append("file", img)
      data.append("upload_preset", "Social-media")
      data.append("cloud_name", "dzy0uevma")
      // const  {signature , timestamp } = await getSignature();           // server side will give a signature for auth... (OPTION-2)
      // data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
      // data.append('signature',signature);
      // data.append('timestamp',timestamp);
      data.append('upload_preset', 'Social-media')
      axiosInstance.post("https://api.cloudinary.com/v1_1/dzy0uevma/image/upload", data)
        .then((result) => {
          setImgUrl(result.data.secure_url)
          console.log(result.data.secure_url)
        }).catch((err) => {
          console.log(err)
          dispatch(returnErrors(err.response));
        })
    }
    UploadImg();
  }, [img])




  useEffect(() => {
    console.log(imgUrl)
    const setImg = async () => {
      if (loggedUser.user == null) {
        return notifyLogin()
      }
      setUploading(false)
      axiosInstance.put('/users/' + id + '/updateuser', { _id: id, img: imgUrl }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
        .then((result) => {
          console.log(result)
          history.go()
        }).catch((err) => {
          console.log(err)
          dispatch(returnErrors(err.response));
        })
    }
    if (img != null)
      setImg();
  }, [imgUrl])



  useEffect(() => {
    axiosInstance.get("/post/userPosts/" + id, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(resp => {
        setPosts(resp.data.message)
      })
      .catch(err => {
        dispatch(returnErrors(err.response));
        console.error(err)
      });
  }, [loading])



  const follow = async () => {
    if (loggedUser.user == null) {
      return notifyLogin()
    }
    if (following) {
      axiosInstance.put('/users/' + user._id + '/unfollow', {
        _id: loggedUser.user,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        console.log(res)
        setFollowing(false)
      }).catch(err => {
        console.log(err)
        dispatch(returnErrors(err.response));
      })
    } else {
      axiosInstance.put('/users/' + user._id + '/follow', {
        _id: loggedUser.user,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
        .then(res => {
          console.log(res)
          setFollowing(true)
        }).catch(err => {
          console.log(err)
          dispatch(returnErrors(err.response));
        })
    }
  }





  return (
    <div>
      <Topbar />
      <Grid container className={classes.container} container >
        <Grid sm={2} md={2} lg={1} className={classes.left} container spacing={10} item={true} >
          <Leftbar />
        </Grid>
        <Grid item sm={8} md={8} lg={5} className={classes.center}>
          <div style={{ marginTop: 80 }}></div>
          <div className={classes.top} >
            <div className="profileRightTop">
              <div className="profileCover">
                {(user._id == loggedUser.user) ? "" :
                  <Button variant="contained" color="secondary" style={{ float: "right" }} onClick={follow}>
                    {following ? "Unfollow " : "Follow "}
                    {following ? <PersonAddDisabledIcon style={{ marginLeft: "7px" }} /> : <PersonAddIcon style={{ marginLeft: "7px" }} />}
                  </Button>
                }
                {loading ? (
                  <Skeleton className="profileUserImg" variant="circle" style={{ height: "70%" }} />
                ) : (
                  <img className="profileUserImg" src={user.img} alt="" />)}
                {loading ? (
                  <Skeleton className="profileUserImg" variant="circle" style={{ height: "70%" }} />
                ) : (
                  <Button className="profileUserImg" src={user.img} alt="" >
                    {(user._id != loggedUser.user) ? "" : (
                      <div>
                        <label htmlFor="file" className="shareOption">
                          <AddPhotoAlternateIcon style={{ fontSize: 40, marginRight: 5, cursor: "pointer", color: "red" }} className="shareIcon" />
                          <input
                            style={{ display: "none" }}
                            type="file"
                            id="file"
                            // accept=".png,.jpeg,.jpg"
                            onChange={(e) => setImg(e.target.files[0])}
                          />
                        </label>
                      </div>)}
                  </Button>)}
                <div className="profileInfo">
                  {loading ? (
                    <Skeleton className="profileInfoName" animation="wave" style={{ width: "74%", left: "75px", height: "125px", top: "13px" }} />
                  ) : (
                    <div>
                      <h4 className="profileInfoName" >{user.username}</h4>
                      <div className="ProfileStatus">
                        {loading ? (
                          <Skeleton animation="wave" height={10} width="15%" />
                        ) : (
                          <Fragment>

                            <span className="prtofileInfoDesc" >Posts: {posts.length}</span>
                            <span className="prtofileInfoDesc" >Followers: {user?.followers?.length}</span>
                            <span className="prtofileInfoDesc" >Followings: {user?.followings?.length}</span>
                          </Fragment>
                        )}
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.imageListWrapper} >
            {posts.map(p => ((
              <div style={{ width: "40%" }}>
                <MyPost post={p} key={p.id} loading={loading} item={true} />
              </div>
            )))}
          </div>
        </Grid>
        <Grid item sm={2} md={2} lg={2} className={classes.right} item={true}>
        </Grid>
      </Grid>
    </div>
  )
}
