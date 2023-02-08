import './ViewPost'
import { React, useEffect, useState, Fragment } from "react";

//material ui
import { Accordion, AccordionDetails, AccordionSummary, Button, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Skeleton from '@material-ui/lab/Skeleton';
import TextField from '@material-ui/core/TextField';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ReportIcon from '@material-ui/icons/Report';

import { toast } from 'react-toastify';

// Sharing
import { SocialIcon } from 'react-social-icons';
import {
    FacebookShareButton,
    RedditShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";


import { useHistory } from "react-router-dom";

//redux
import { useSelector, useDispatch } from 'react-redux'
import { removeSelectedPost } from "../../redux/actions/postActions";
import { returnErrors } from "../../redux/actions/errorActions";

import axios from "axios"
import { Popover } from '@mui/material';
import { axiosInstance } from '../../config';



/**
 * Matrail ui Styles
 */


const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

    },
    rightViewPost: {
        width: "146%",
        height: "auto",
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

    },
    leftViewPost: {
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    rootLeft: {
        objectFit: "cover",
        width: "30vw",
        height: "60vh",
        lineHeight: "60vh",
        [theme.breakpoints.down("1200")]: {
            width: "100%",


        },

    },
    rootLeftVideo: {
        objectFit: "cover",
        width: "30vw",
        height: "60vh",
        lineHeight: "60vh",
        backgroundColor: "black",
        [theme.breakpoints.down("1200")]: {
            width: "100%",
            height: "auto",
        },

    },
    rootRight: {
        height: "60vh",
        width: "94vw",

        overflow: "auto",
    },
    leftViewPost: {
        height: "100%",
        width: "50%",
    },
    media: {
        width: "100%", maxHeight: "400px",

    },
    expand: {
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    avatar: {
        backgroundColor: red[500],
    }, title: {
        display: "flex-end",
        marginLeft: "auto",
    },
    comments: {
        display: "flex-end",
    },
    textContent: {
        fontSize: "21px",
        fontWeight: "300",
        color: "black"
    },
    headerTitle: {
        fontSize: "27px",
        fontWeight: "inherit"
    },
    headerSubheader: {
        fontSize: "18px",
        fontWeight: "200",
        color: "black"
    },
    description: {
        color: "#505050",
        fontSize: "medium",
        fontFamily: "-webkit-pictograph",
        textAlign: "center"
    },
    content: {
        color: "black",
        fontSize: "large",
        fontFamily: "-webkit-pictograph",
        textAlign: "center"
    },
    hr: {
        width: "77%",
        backgroundColor: "#ff000096",
        marginLeft: "auto",
        marginRight: "auto",
        height: "3px",
        padding: "1px",
        marginTop: "10px",
        marginBottom: "4px",
    },
    buttons: {
        float: "right",
    },
    commentingBar: {
        color: "red",
        fontFamily: 'Roboto',
        textAlign: "center",
        fontSize: "22px",
        fontWeight: "800",
        fontVariant: "all-petite-caps",
        marginRight: "21px",
        TextEmphasisStyle: "filled"
    },
    accordion: {
        width: '100%',
        marginTop: "50px",
        boxShadow: "none",
        display: "inline-block",
        height: "&:before 0px",
        '&::before': { height: "0px" }
    },
    CommentsIcons: {
        width: "30vw",
        overflowWrap: "anywhere",
        [theme.breakpoints.down("1200")]: {
            width: "45vw",
        },
        [theme.breakpoints.down("500")]: {
        width: "60vw",
    },
    },
    Share:{
        backgroundColor: "transparent",boxShadow: "none",display:"flex",padding: "3px"
   }

}));






export default function ViewPost({ postId }) {

    let history = useHistory();
    const post = useSelector((state) => state.post);
    const dispatch = useDispatch();


    const classes = useStyles();
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState("")
    const [comments, setComments] = useState("")
    const [commentsContent, setcommentsContent] = useState([])
    const [commentsContentNext, setcommentsContentNext] = useState([])
    const [commented, setCommented] = useState(false)
    const [commenting, setCommenting] = useState('');
    const loggedUser = useSelector((state) => state.auth);
    const [first, setFirst] = useState(0)
    const [last, setLast] = useState(5)
    const [isLiked, setIsLiked] = useState(false);
    const [currentUser, setCurrentUser] = useState()
    const [currentUserImg, setCurrentUserImg] = useState()
    const [currentUserId, setCurrentUserId] = useState()
    const [finish, setFinish] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    var path = require('path')

    /**
    * Notificattion
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


    const notifySuccess = () => toast.success('Successfully deleted !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });


    /**
     * Sharing icons
     */

    const actions = [
        { icon: <FacebookShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="facebook" style={{ height: 25, width: 25 }} />  </FacebookShareButton>, name: 'Facebook' },
        { icon: <RedditShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="reddit" style={{ height: 25, width: 25 }} /> </RedditShareButton>, name: 'Reddit' },
        { icon: <TwitterShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="twitter" style={{ height: 25, width: 25 }} /> </TwitterShareButton >, name: 'Twitter' },
        { icon: <WhatsappShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="whatsapp" style={{ height: 25, width: 25 }} /> </WhatsappShareButton>, name: 'Whatsapp' },
    ];




    const fetchMoreData = async () => {

        await axiosInstance.get('post/' + post._id)
            .then(res => {
                if (last < comments) {
                    setFirst(first + 5);
                    setLast(last + 5);
                    setcommentsContentNext(commentsContentNext.concat((res.data.message.comments).slice(first, last)))
                } else {

                    setFirst(comments - first);
                    setLast(comments);

                    setcommentsContentNext(commentsContentNext.concat((res.data.message.comments).slice(first, last)))
                    setFirst(comments);
                    setLast(comments + 1);
                    setFinish(true)

                }
            }
            )

    }


    useEffect(() => {
        const displaymore = () => {
            return (
                <Typography color="textSecondary" component={'span'}  >
                </Typography>
            )
        }
        displaymore()
    }, [])




    useEffect(() => {

        const fetchUser = async () => {
            
            Promise.all([await axiosInstance.get('users/getuser/' + post.userId)
                .then(res => {
                    setUser(res.data)
                    setLoading(false);
                })])

            const secondResponse = await axiosInstance.get('post/' + post._id)
                .then(res => {
                    setLikes(res.data?.message?.likes?.length)
                    setComments(res.data?.message?.comments?.length)
                    setcommentsContent(res.data?.message?.comments)
                    setIsLiked(res.data?.message?.likes.includes(loggedUser.user));
                }
                )


            await axiosInstance.get('/users/getuser/' + loggedUser.user)
                .then(res => {

                    setCurrentUser(res.data.username)
                    setCurrentUserImg(res.data.img)
                    setCurrentUserId(res.data._id)


                })

        }
        if (post.userId) {
            fetchUser();
        }
    }, [loading])



    useEffect(() => {

        const fetchCurrentUser = async () => {
            Promise.all([await axiosInstance.get('/users/getuser/' + loggedUser.user)
                .then(res => {
                    setCurrentUser(res.data.username)
                    setCurrentUserImg(res.data.img)

                })])


        }

        fetchCurrentUser();
    }, [])



    useEffect(() => {
        return () => {
            dispatch(removeSelectedPost())
        }
    }, [])


    const handleChangeComment = (event) => {
        setCommenting(event.target.value);
    };


    function userProfile(userId) {
        if (loggedUser.user == null) {
            return notifyLogin()
        }
        history.push(`/profile/` + userId);
    }


    const HandlerComment = async () => {
        if (loggedUser.user == null) {
            return notifyLogin()
        }
        setCommented(true);
        const usersend = { text: commenting, username: currentUser, userId: loggedUser.user, img: currentUserImg }


        const firstResponse = await Promise.all([
            axiosInstance.put("/post/" + post._id + "/comment", usersend, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })

        ]);

        const secondResponse = await axiosInstance.get('post/' + post._id)
            .then(res => {
                setComments(res.data.message.comments.length)
                setcommentsContent(res.data.message.comments)

            }
            )


    }


    const deletePost = async (postId) => {
        if (loggedUser.user == null) {
            return notifyLogin()
        }
        const usersend = {
            userId: loggedUser.user,
            userPostId: post.userId
        }


        await axiosInstance.delete('/post/' + postId, usersend, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(resp => {
                notifySuccess()
                setTimeout(function () {

                    history.go()
                }, 2500)
            })
            .catch(err => {
                console.log(err)
                dispatch(returnErrors(err.response));
            })


    }

      /**
      * Popup  options
      * 
      */

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function popup() {

        return (
            <Menu style={{ marginTop: "47px" }}
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >{
                    (loggedUser.user === post.userId) ? (
                        <MenuItem onClick={() => deletePost(post._id)}><DeleteOutlineIcon /> Delete</MenuItem>
                    ) : (
                        <MenuItem onClick={handleClose, notifyLogin}><ReportIcon /> Report</MenuItem>
                    )}
            </Menu>
        )
    }





    const likeHandler = async () => {

        if (loggedUser.user == null) {
            return notifyLogin()
        }

        const usersend = { userId: loggedUser.user }

        const firstResponse = await Promise.all([
            axiosInstance.put("/post/" + post._id + "/like", usersend, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })

        ]);

        const secondResponse = await axiosInstance.get('post/' + post._id)
            .then(res => {
                setLikes(res.data.message.likes.length)
                setIsLiked(res.data.message.likes.includes(loggedUser.user));

            }
            )

    }

    const deleteComment = async (id) => {

        const commentId = { _id: id };

        const firstResponse = await Promise.all([
            axiosInstance.put('/post/' + post._id + '/comment/delete', commentId, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })               
                .catch((err) => {
                    console.log(err)
                })

        ]);

        const secondResponse = await axiosInstance.get('post/' + post._id)
            .then(res => {
                setcommentsContentNext(res.data.message.comments)
                setComments(res.data.message.comments.length)

            }
            )

    }




    /**
    * Checking screen width
    */


    const [screenWidth, setScreenWidth] = useState();

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        handleResize();

    });

    const handleResize = () => {
        setScreenWidth(window.outerWidth);
    }





    /**
     * popup Share
     */


    const [anchorElShare, setAnchorElShare] = useState(null);

    const handleClickShare = (event) => {
        setAnchorElShare(event.currentTarget);
    };

    const handleCloseShare = () => {
        setAnchorElShare(null);
    };

    const openShare = Boolean(anchorElShare);
    const idShare = openShare ? 'simple-popover' : undefined;





    if (screenWidth < 1200) {
        return (
            <div >
                <Container className={classes.container}>
                    <div className={classes.rightViewPost}>
                        <Card className={classes.rootRight}>
                            <CardHeader
                                avatar={

                                    <Avatar
                                        src={user.img} onClick={() => userProfile(post.userId)} style={{ cursor: "pointer" }}
                                    />
                                }
                                action={
                                    (loading ? null : (
                                        <IconButton aria-label="settings" onClick={handleClick}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    ))
                                }
                                title={

                                    <Typography className={classes.title} > {post.title} </Typography>
                                }
                                subheader={loading ? <Skeleton animation="wave" height={10} width="40%" /> : user.username + '  (5 hours ago)'}
                            />

                            {popup()}

                            <CardContent>
                                <Typography className={classes.description} variant="body2" color="textSecondary" component="p">
                                    {post.description}
                                </Typography>
                                <hr className={classes.hr} />
                                <Typography className={classes.content} variant="body2" color="textSecondary" component="p">
                                    {post.content}
                                </Typography>
                                {(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(post.img)))) ? (
                                    <div className={classes.rootLeft}   >
                                        <div >
                                            <img src={post.img} style={{ maxHeight: "300px", width: "100%", marginTop: "20px" }} />
                                        </div>
                                    </div>
                                )
                                    :
                                    (
                                        <div className={classes.rootLeftVideo} >
                                            <div style={{ maxHeight: "400px", width: "100%", marginTop: "20px" }}>
                                                <CardMedia
                                                    component='video'
                                                    className={classes.media}
                                                    src={post.img}
                                                    controls
                                                />
                                            </div>
                                        </div>

                                    )
                                }

                                <CardActions disableSpacing style={{ marginBottom: "20px" }}>

                                    {loading ? (
                                        <Skeleton animation="wave" height={8} width="3%" />
                                    ) : (
                                        <Fragment>

                                            <IconButton aria-label="add to favorites" onClick={likeHandler}>
                                                {isLiked ? <ThumbUp style={{ color: "red" }} /> : <ThumbUp />}
                                            </IconButton>
                                            <Typography  > {likes}</Typography>
                                        </Fragment>

                                    )}

                                    <div  >
                                        <ShareIcon style={{ marginLeft: "10px", cursor: "pointer" }} onClick={handleClickShare} />

                                        <Popover
                                            id={idShare}
                                            open={openShare}
                                            anchorEl={anchorElShare}
                                            onClose={handleCloseShare}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >   <div className={classes.Share}>
                                                {actions.map((action, index) => (
                                                    <div key={index} style={{ cursor: "pointer", padding: "10px" }}>
                                                        {action.icon}
                                                    </div>
                                                ))}
                                            </div>
                                        </Popover></div>

                                </CardActions>

                                {commented ? (
                                    <h3 className={classes.commentingBar} ><DoneOutlineIcon /> Commented</h3>
                                ) : (
                                    <Fragment >

                                        <TextField
                                            id="standard-multiline-flexible"
                                            placeholder="Add a comment..."
                                            multiline
                                            maxRows={4}
                                            fullWidth
                                            inputProps={{ maxLength: 400 }}
                                            value={commenting}
                                            onChange={handleChangeComment}
                                        />
                                        <div className={classes.buttons}>
                                            <Button variant="contained" color="secondary" onClick={HandlerComment}>
                                                Comment
                                            </Button>
                                        </div>
                                    </Fragment>
                                )}

                                {loading ? (
                                    <Skeleton animation="wave" height={10} width="15%" />
                                ) : (
                                    <Accordion className={classes.accordion} onClick={fetchMoreData}  >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.comments} >
                                                {comments} Comments:
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>

                                            <Typography color="textSecondary" component={'span'}  >
                                                {commentsContentNext.map((items,index) =>

                                                    <ListItem className={classes.CommentsIcons} key={index}>
                                                        <ListItemAvatar>
                                                            <Avatar src={currentUserImg} onClick={() => { userProfile(user._id) }} style={{ cursor: "pointer" }} />
                                                        </ListItemAvatar>
                                                        <ListItemText primary={

                                                            <Typography style={{ color: "red", fontWeight: "500" }}>
                                                                {items.userId != loggedUser.user ? "" : <HighlightOffIcon fontSize='medium' onClick={() => { deleteComment(items._id) }} style={{ float: "right", cursor: "pointer" }} />}
                                                                {items.username}
                                                            </Typography>
                                                        }
                                                            secondary={
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                    style={{ color: "black", fontSize: "medium" }}
                                                                >
                                                                    {items.text}
                                                                </Typography>


                                                            } />
                                                    </ListItem>
                                                )}
                                            </Typography>
                                        </AccordionDetails>
                                        {loading || finish ? "" : <Button variant="contained" color="secondary" onClick={fetchMoreData} style={{ float: "left" }}  >
                                            Show more
                                        </Button>}
                                    </Accordion>
                                )}

                            </CardContent>
                        </Card>

                    </div>

                </Container>

            </div >
        )
    } else {

        return (
            <div >
                <Container className={classes.container}>
                    {(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(post.img)))) ? (
                        <div className={classes.rootLeft}   >
                            <Card elevation={5} style={{
                                backgroundImage: `url(${post.img})`,
                                backgroundRepeat: 'no-repeat',

                            }} >
                                <div style={{/* backdropFilter:" blur(10px)",*/ backdropFilter: "brightness(0.3)" }}>
                                    <img src={post.img} style={{ maxHeight: "400px", width: "100%", verticalAlign: "middle" , objectFit: "cover"  }} />
                                </div>
                            </Card>

                        </div>
                    )
                        :
                        (
                            <div className={classes.rootLeftVideo} >
                                <Card elevation={5} style={{ backgroundColor: "black" }} >
                                    <div style={{ maxHeight: "400px", width: "100%", marginTop: "100px", backdropFilter: "brightness(0.3)" }}>
                                        <CardMedia
                                            component='video'
                                            className={classes.media}
                                            src={post.img}
                                            controls
                                        />
                                    </div>
                                </Card>
                            </div>
                        )
                    }
                    <div className={classes.rightViewPost}>
                        <Card className={classes.rootRight}>
                            {popup()}
                            <CardHeader
                                avatar={
                                    <Avatar
                                        src={user.img} onClick={() => userProfile(post.userId)} style={{ cursor: "pointer" }}
                                    />
                                }
                                action={
                                    (loading ? null : (
                                        <IconButton aria-label="settings" onClick={handleClick}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    ))
                                }
                                title={

                                    <Typography className={classes.title} > {post.title} </Typography>
                                }
                                subheader={loading ? <Skeleton animation="wave" height={10} width="40%" /> : user.username + '  (5 hours ago)'}
                            />


                            <CardContent>

                                <Typography className={classes.description} variant="body2" color="textSecondary" component="p">
                                    {post.description}
                                </Typography>
                                <hr className={classes.hr} />
                                <Typography className={classes.content} variant="body2" color="textSecondary" component="p">
                                    {post.content}
                                </Typography>

                                <CardActions disableSpacing style={{ marginBottom: "20px" }}>

                                    {loading ? (
                                        <Skeleton animation="wave" height={8} width="3%" />
                                    ) : (
                                        <Fragment>

                                            <IconButton aria-label="add to favorites" onClick={likeHandler}>
                                                {isLiked ? <ThumbUp style={{ color: "red" }} /> : <ThumbUp />}
                                            </IconButton>

                                            <Typography > {likes}</Typography>
                                        </Fragment>

                                    )}

                                    <div  >
                                        <ShareIcon style={{ marginLeft: "10px", cursor: "pointer" }} onClick={handleClickShare} />

                                        <Popover
                                            id={idShare}
                                            open={openShare}
                                            anchorEl={anchorElShare}
                                            onClose={handleCloseShare}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >   <div className={classes.Share}>
                                                {actions.map((action, index) => (
                                                    <div key={index} style={{ cursor: "pointer", padding: "10px" }}>
                                                        {action.icon}
                                                    </div>
                                                ))}
                                            </div>
                                        </Popover></div>

                                </CardActions>

                                {commented ? (
                                    <h3 className={classes.commentingBar} ><DoneOutlineIcon /> Commented</h3>
                                ) : (
                                    <Fragment >

                                        <TextField
                                            id="standard-multiline-flexible"
                                            placeholder="Add a comment..."
                                            multiline
                                            maxRows={4}
                                            fullWidth
                                            inputProps={{ maxLength: 400 }}
                                            value={commenting}
                                            onChange={handleChangeComment} />

                                        <div className={classes.buttons}>
                                            <Button variant="contained" color="secondary" onClick={HandlerComment}>
                                                Comment
                                            </Button>

                                        </div>
                                    </Fragment>

                                )}

                                {loading ? (
                                    <Skeleton animation="wave" height={10} width="15%" />
                                ) : (
                                    <Accordion className={classes.accordion} onClick={fetchMoreData}  >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.comments} >
                                                {comments} Comments:
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>

                                            <Typography color="textSecondary" component={'span'}  >
                                                {commentsContentNext.map((items,index) =>

                                                    <ListItem className={classes.CommentsIcons} key={index}>
                                                        <ListItemAvatar>
                                                            <Avatar src={currentUserImg} onClick={() => { userProfile(user._id) }} style={{ cursor: "pointer" }} />
                                                        </ListItemAvatar>
                                                        <ListItemText primary={

                                                            <Typography style={{ color: "red", fontWeight: "500" }}>
                                                                {items.userId != loggedUser.user ? "" : <HighlightOffIcon fontSize='medium' onClick={() => { deleteComment(items._id) }} style={{ float: "right", cursor: "pointer" }} />}
                                                                {items.username}
                                                            </Typography>
                                                        }
                                                            secondary={
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"

                                                                    style={{ color: "black", fontSize: "medium" }}
                                                                >
                                                                    {items.text}
                                                                </Typography>
                                                            } />
                                                    </ListItem>
                                                )}
                                            </Typography>
                                        </AccordionDetails>
                                        {loading || finish ? "" : <Button variant="contained" color="secondary" onClick={fetchMoreData} style={{ float: "left" }}  >
                                            Show more
                                        </Button>}
                                    </Accordion>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </Container>
            </div >
        )
    }
}
