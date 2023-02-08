import { React, useEffect, useState } from "react";

//material ui
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { useDispatch } from "react-redux";
import Modal from '@mui/material/Modal';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Skeleton } from "@material-ui/lab";

//redux
import { selectedPost, removeSelectedPost } from "../../redux/actions/postActions";

import ViewPost from "../viewPost/ViewPost";



/**
 * Matrail ui Styles
 */

const useStyles = makeStyles((theme) => ({

    root: {
        height: 280,
        width: "107%",
        marginTop: 20,
        marginBottom: 30,
    },
    media: {

        maxHeight: 300,
        paddingTop: "56.25%", // 16:9
    },
    postTitle: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: " -webkit-box",
        " -webkit-line-clamp": " 2",
        "-webkit-box-orient": "vertical"

    },
    postDescription: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: " -webkit-box",
        " -webkit-line-clamp": " 2",
        "-webkit-box-orient": "vertical"
    }
}));



/**
 * Modal Styles
 */

const customStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const customStylesMobile = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '98%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};




export default function MyPost({ post, loading }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    var path = require('path')






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
      * Modal for each screen width
      */

      const handleModalOpen = () => {
        dispatch(selectedPost(post))
        setOpen(true)
    };

    const handleModalClose = () => {
        setOpen(false)
    };



    function modalopening() {
        if (screenWidth < 600) {
            return (

                <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    disableBackdropClick >

                    <Box sx={customStylesMobile}>
                        <HighlightOffIcon fontSize='large' onClick={handleModalClose} style={{ float: "right", cursor: "pointer" }} />
                        <ViewPost />
                    </Box>

                </Modal>

            )
        } else {
            return (
                <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">

                    <Box sx={customStyles}>
                        <HighlightOffIcon fontSize='large' onClick={handleModalClose} style={{ float: "right", cursor: "pointer" }} />
                        <ViewPost />
                    </Box>

                </Modal>
            )
        }
    }







    return (
        <div >
            <Card className={classes.root}>
                {modalopening()}
                <CardActionArea onClick={() => handleModalOpen(post)}>
                    {(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(post.img)))) ? (
                        <div >
                            {loading ? (
                                <Skeleton variant="rect" width={"100%"} height={140} />
                            ) : (
                                <CardMedia style={{ height: "140px", width: "100%", paddingTop: "2%" }}
                                    component='img'
                                    className={classes.media}
                                    src={post.img}

                                />)}
                        </div>
                    ) : (
                        <div>
                            {loading ? (
                                <Skeleton variant="rect" width={"100%"} height={140} />

                            ) : (
                                <CardMedia style={{ height: "140px", width: "100%", paddingTop: "2%" }}
                                    component='video'
                                    className={classes.media}
                                    src={post.img}

                                />)}
                        </div>
                    )}
                    <CardContent>
                        {loading ? (
                            <div>
                                <Skeleton animation="wave" style={{ marginRight: "33px" }} height={10} width="80%" style={{ marginRight: "20px", marginBottom: 6 }} />
                                <Skeleton animation="wave" style={{ marginRight: "33px" }} height={10} width="40%" />
                            </div>
                        ) : (
                            <div >
                                <Typography className={classes.postTitle} gutterBottom variant="h5" component="h2">
                                    {post.title}
                                </Typography>
                                <Typography className={classes.postDescription} variant="body2" color="textSecondary" component="p">
                                    {post.description}
                                </Typography>
                            </div>
                        )}
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>

    )
}
