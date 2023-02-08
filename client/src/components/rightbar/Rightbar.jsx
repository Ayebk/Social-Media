import React, { useEffect, useState , Fragment } from "react";

//material ui
import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Skeleton from '@material-ui/lab/Skeleton';

//redux
import { returnErrors } from "../../redux/actions/errorActions";
import { selectedPost } from "../../redux/actions/postActions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { useSelector } from 'react-redux'

import axios from "axios";

import ViewPost from "../viewPost/ViewPost";

import Modal from 'react-modal';
import { axiosInstance } from "../../config";

import { toast } from 'react-toastify';


/**
 * Matrail ui Styles
 */



const useStyles = makeStyles((theme) => ({
    container: {
        height: "90vh",
        paddingTop: theme.spacing(5),
        position: "sticky",
        top: 10, /* required */

    },
    trends: {

        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
    },


    imageList: {
        width: "100%",
        objectFit: "contain",

    },
    imageListItem: {
        width: "100%",
        height: "130px",
        backgroundColor: "#000000",
        objectFit: "cover"
    },
    imageListItemVid: {
        backgroundColor: "red",
    },
    icon: {
        color: "rgba(255, 255, 255, 0.54)",
    },
    trendsTitle: {
        background: "none",
        textAlign: "center",
        fontWeight: 500,
        marginTop: "70px",
        marginBottom: "10px"
    },
    popularTitle: {
        background: "none",
        textAlign: "center",
        fontWeight: 500,
        marginTop: "20px",
        marginBottom: "10px"
    },
    ListPopular: {
        width: "80%",
        display: "table-cell",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "-webkit-center"


    },
    suggestion: {

    },
    media: {
        height: 0,
        paddingTop: "56.25%", // 16:9
    },


}));


/**
 * Modal Styles
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


export default function Rightbar() {


    
    const classes = useStyles();
    const [trends, setTrends] = useState([])
    const [popular, setPopular] = useState([])
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    let history = useHistory();
    var path = require('path')
    const loggedUser = useSelector((state) => state.auth);



    
    useEffect(() => {

        axiosInstance.get('/post/getTrends')
            .then(res => {
                setTrends(res.data.message)
                setLoading(false)

            })
            .catch(err => {
                console.log(err)
                dispatch(returnErrors(err.response));
            })
    }, [trends])

    useEffect(() => {

        axiosInstance.get('/users/popular')
            .then(res => {
                setPopular(res.data.message)
            })
            .catch(err => {
                console.log(err)
                dispatch(returnErrors(err.response));
            })
    }, [])


    const notifyLogin = () => toast.info('You have to Login first !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });



    const userProfile = (userId) => {
        if (loggedUser.user == null) {
            return notifyLogin()
        }

        history.push(`/profile/` + userId);

    }



          /**
          * Modal 
          */

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal(post) {
        dispatch(selectedPost(post))

        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);

    }

    function showView(postId) {

        return (
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal">

                <HighlightOffIcon fontSize='large' onClick={closeModal} style={{ float: "right", cursor: "pointer" }} />
                <ViewPost postId={postId} />

            </Modal>
        )

    }


 


    return (

        <Container className={classes.container} >

            <div className={classes.trendsTitle}>
                <Typography variant="h6"   >
                    Trends:
                </Typography>
            </div>

            {loading ? (
                <div className={classes.popularTitle} >


                    <Skeleton variant="rect" height={300} style={{ opacity: "0.3" }} />
                    <Typography variant="h6" style={{ marginTop: "30px", marginBottom: "5px" }}   >
                        Most Popular:
                    </Typography>
                    <Fragment>
                        <Skeleton variant="circle" width={40} height={40} style={{ marginBottom: "10px", marginLeft: "10px" }} />
                        <Skeleton variant="circle" width={40} height={40} style={{ marginBottom: "10px", marginLeft: "10px" }} />
                        <Skeleton variant="circle" width={40} height={40} style={{ marginBottom: "10px", marginLeft: "10px" }} />
                    </Fragment>
                </div>
            ) : (

                <div className={classes.trends}>
                    <ImageList  rowHeight={"auto"} className={classes.imageList} cols={1}>
                        {trends.map((item, index) => (
                            <div key={index} >



                                <ImageListItem key={item.img} onClick={() => openModal(item)} style={{ cursor: "pointer" }}>

                                    {(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(item.img)))) ?
                                        <img className={classes.imageListItem} src=
                                            {item.img}

                                            alt={item.title} /> :

                                        <video className={classes.imageListItem} src=
                                            {item.img}

                                            alt={item.title} />
                                    }

                                    <ImageListItemBar
                                        title={item.title}

                                        classes={{
                                            root: classes.titleBar,
                                            title: classes.title,
                                        }}
                                    />

                                </ImageListItem>


                                {showView(item._id)}
                            </div>
                        ))}
                    </ImageList>
                </div>
            )}


            <div className={classes.ListPopular} >

                <List >
                    <div className={classes.popularTitle}>
                        {loading ? (
                            <Skeleton animation="wave" variant="rect" className={classes.popularTitle} />
                        ) : (
                            <Typography variant="h6"   >
                                Most Popular:
                            </Typography>)}
                    </div>

                    {popular.map((item, index) => (
                        <div key={index}>
                            <ListItem className={classes.suggestion}>
                                <ListItemAvatar>
                                    <Avatar src={
                                        loading ? (
                                            <Fragment>
                                                <Skeleton variant="circle" width={40} height={40} />
                                                <Skeleton variant="circle" width={40} height={40} />
                                                <Skeleton variant="circle" width={40} height={40} />
                                            </Fragment>
                                        ) : (
                                            item.img)}


                                        onClick={() => { userProfile(item._id) }} style={{ cursor: "pointer" }} />

                                </ListItemAvatar>
                                <ListItemText primary={item.username} />
                            </ListItem>
                        </div>
                    ))}
                </List>

            </div>


        </Container>
    )
}
