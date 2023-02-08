import { React, useState, useEffect } from "react";

//material ui
import { Avatar, Box, Button, Container, TextField,  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import PostAddIcon from '@material-ui/icons/PostAdd';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Cancel } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//redux
import { returnErrors } from "../../redux/actions/errorActions";
import animationLoading from '../../assets/lottiefiles/motion.json'
import { useSelector, useDispatch } from 'react-redux'
import { createPost } from "../../redux/actions/postActions";

import Lottie from 'react-lottie-player'

import Modal from 'react-modal';

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios"
import { axiosInstance } from "../../config";
import { useHistory } from "react-router-dom";



/**
 * Matrail ui Styles
 */

const useStyles = makeStyles((theme) => ({
    container: {
        height: "32vh",
        marginTop: "20px",
        paddingTop: theme.spacing(3),
        marginBottom: "50px",
        display: "table",
        width: "90%",
        border: "1px solid #e6e6e6",
        borderRadius: "5px",
        top: 10,
        opacity: "60%",
        "&:hover": {
            opacity: "100%",

        },
        "&:focus": {
            opacity: "100%",
            backgroundColor: "red"
        },

    },
    inputFocused: {
        opacity: "100%",

    },
    box: {

        padding: "12px 49px 8px 14px",
        background: "#ff000005",
        borderRadius: "5px",
        [theme.breakpoints.down("400")]: {
            padding: "12px 12px 5px 0px",
        },
        [theme.breakpoints.down("350")]: {
            padding: "12px 0px 5px 0px",
        }


    },
    share: {
        display: "flex",
        alignItems: "baseline",
    },
    shareTitle: {
        marginLeft: "18px"
    },
    shareDescription: {
        justifyContent: "center",
        marginLeft: "50px",
        marginTop: "15px",
    },
    shareDetails: {
        justifyContent: "center",
        marginTop: "15px",
    },
    shareButton: {
        paddingTop: theme.spacing(0),
        paddingRight: theme.spacing(-10),
        textAlign: "right",
    },
    shareIcons: {
        display: "flex",
        marginLeft: "50px",
        marginTop: "5px",
    },
    modalTitle: {
        fontWeight: "lighter",
        fontFamily: 'Roboto',
        marginLeft: '1px'
    },
    shareImgContainer: {
        padding: "10px 20px 10px 20px",
        position: "relative",
        width: "100%",
        textAlign: "end"
    },
    shareImg: {

    },
    shareCancelImg: {
        position: "absolute",
        top: 10,
        right: "-10px",
        cursor: "pointer",
        opacity: "0.7",
        color: "red"
    },
    animation:{
        textAlign: "-webkit-center",
        marginLeft: "64px",
        position: "absolute",
        top: "136px",
        right: "145px",
        backgroundColor: "#ff0000c7",
        borderRadius: "50%",
    }
}));



/**
 * Modal Styles
 */

const customStyles = {
    content: {
        height: '38%',
        width: '70%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');




export default function Share() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.auth);
    
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [img, setImg] = useState("")
    const [imgUrl, setImgUrl] = useState();
    const [share, setShare] = useState(false)
    const [userImg, setUserImg] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('');

    const handleCategory = (event) => {
        setCategory(event.target.value);
    };

    var path = require('path')

/**
 * Notifications
 *  
 */



    const notifySuccessImg = () => toast.success('Successfully Posted !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifySuccessVid = () => toast.info('Video Upladoing... may take a few seconds', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });

    const notifyFill = () => toast.info('You have to fill the Title, Description and Catergory', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });



    /**
     * Modal 
    */

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleAdd = () => {
        closeModal();
        setContent("");
    }

    const handleShare = () => {
        closeModal();
        setShare(true);
    }




    useEffect(() => {


        const Uploading = async () => {
            let post;
            setUploading(false);
            if (img) {
                post = {
                    userId: user.user,
                    title,
                    description,
                    content,
                    categoryId: category,
                    img: imgUrl
                }
            } else {
                post = {
                    userId: user.user,
                    title,
                    description,
                    content,
                    categoryId: category
                }
            }

            axiosInstance.post("/post/", post, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
                .then(resp => {
                    dispatch(createPost(resp.data))


                    notifySuccessImg()
                    setTimeout(function () {
                        history.push("/");
                        history.go();
                    }, 2500);

                })
                .catch(err => {
                    dispatch(returnErrors(err.response));
                })
        }
        Uploading()

    }, [imgUrl])





    useEffect(() => {
        axiosInstance.get("/users/getuser/" + user.user)
            .then(res => {
                setUserImg(res.data.img);
                setLoading(false);


            }).catch(err => {
                console.log(err)
                dispatch(returnErrors(err.response));
            })

    }, [])



    const UploadImg = async () => {
        console.log(title)
        console.log(description)

        if (description == '' || title == '' || category == '') {
            return notifyFill();
        }
        setUploading(true)

        console.log(img)
        console.log(path.extname(img))

        if (['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(img.name))) && img != '') {



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

                }).catch((err) => {
                    console.log(err)
                    dispatch(returnErrors(err.response));
                })

        } else if (['.png', '.jpeg', '.jpg', '.bmp', undefined].indexOf((path.extname(img.name))) && img != '') {

            // const  {signature , timestamp } = await getSignature();           // server side will give a signature for auth... (OPTION-2)
            // data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
            // data.append('signature',signature);
            // data.append('timestamp',timestamp);

            notifySuccessVid()
            const data = new FormData();
            data.append("file", img)
            data.append("upload_preset", "Social-media")
            data.append("cloud_name", "dzy0uevma")
            axiosInstance.post("https://api.cloudinary.com/v1_1/dzy0uevma/video/upload", data)
                .then((result) => {
                    setImgUrl(result.data.secure_url)
                })

        }

        else {
            setImgUrl(null)
        }


    }

   



    return (

        <div>
            <Container className={classes.container}  >
               
                <Box boxShadow={10} className={classes.box}>
                    <div className={classes.share}>
                        {loading ? <Skeleton variant="circle" width={40} height={40} />
                            :
                            <Avatar alt="Remy Sharp" src={userImg} />}
                        <TextField
                            className={classes.shareTitle}
                            label="Title"
                            width="270px"
                            id="standard-size-normal"
                            placeholder="What it's about?"
                            color="secondary"
                            style={{ width: 230 }}
                            inputProps={{ maxLength: 29 }}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={classes.shareDescription}>
                    
                        <TextField
                            label="Description"
                            multiline
                            rows={2}
                            color="secondary"
                            inputProps={{ maxLength: 130 }}
                            fullWidth
                            variant="filled"

                            placeholder="Description.."
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} style={{ marginLeft: "50px" }}>
                            <InputLabel id="helper-label">Category</InputLabel>
                            <Select
                                labelId="helper-label"
                                value={category}
                                onChange={handleCategory}
                                value={category}
                                label="Category"
                                inputProps={{ 'aria-label': 'Without label' }}
                            >

                                <MenuItem value={"6124d825c1970235b0610938"}>Nature</MenuItem>
                                <MenuItem value={"6124d871c1970235b061093a"}>Social</MenuItem>
                                <MenuItem value={"6124d895c1970235b061093c"}>Science</MenuItem>
                                <MenuItem value={"6124d8fbc1970235b061093e"}>Health</MenuItem>
                                <MenuItem value={"61406c4105a519ada4cd0d1f"}>Random</MenuItem>
                                <MenuItem value={"61406ce305a519ada4cd0d20"}>Others</MenuItem>

                            </Select>
                        </FormControl>

                    </div>

                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <HighlightOffIcon fontSize='large' onClick={() => handleAdd()} style={{ float: "right", cursor: "pointer" }} />

                        <h3 className={classes.modalTitle}>More Details:</h3>

                        <div className={classes.shareDetails}>

                            <TextField
                                id="outlined-multiline-static"
                                label="Detail it"
                                multiline
                                defaultValue={content}
                                rows={10}
                                color="secondary"
                                inputProps={{ maxLength: 650 }}
                                fullWidth
                                placeholder="Tell more..."
                                variant="outlined"
                                onChange={(e) => setContent(e.target.value)

                                }
                            />
                        </div>
                        <div className={classes.shareButton} style={{ marginTop: 20 }}>
                            <Button variant="contained" color="secondary" onClick={() => handleShare()}>
                                Add
                            </Button>
                        </div>
                    </Modal>

                    {img && (
                        <div className={classes.shareImgContainer}>
                            {(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(img.name)))) ? (
                                <div >
                                    {uploading ? 
                                    <div  >
                                     <Lottie  lassName={classes.animation}
                                     loop
                                     animationData={animationLoading}
                                     play
                                     style={{ width: 120, height: 120 ,marginLeft: "45%"}}
                                 />
                                 </div>

                                    : ""}
                                    <img src={classes.shareImg} s src={URL.createObjectURL(img)} width="90%" height="auto" style={{ marginLeft: "auto", marginRight: "auto" }} />
                                </div>
                            ) :

                                (
                                    <div>
                                         {uploading ? 
                                    <div  >
                                     <Lottie lassName={classes.animation}
                                     loop
                                     animationData={animationLoading}
                                     play
                                     style={{ width: 120, height: 120 ,marginLeft: "45%"}}
                                 />
                                 </div>

                                    : ""}
                                        <video src={classes.shareImg} s src={URL.createObjectURL(img)} width="90%" height="auto" style={{ marginLeft: "auto", marginRight: "auto" }} />
                                    </div>
                                )
                            }
                            <Cancel className={classes.shareCancelImg} onClick={() => setImg(null)} />
                        </div>
                    )}
                    <div className={classes.shareIcons}>
                        <label htmlFor="file" className="shareOption">
                            <AddPhotoAlternateIcon style={{ fontSize: 40, marginRight: 5, cursor: "pointer" }} className="shareIcon" />
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="file"
                                // accept=".png,.jpeg,.jpg"
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                        </label>
                        <PostAddIcon style={{ fontSize: 40, marginLeft: "auto", cursor: "pointer" }} onClick={() => openModal()} />

                    </div>
                    <div className={classes.shareButton} style={{ marginBottom: 5 }}>
                        <Button variant="contained" color="secondary" onClick={() => UploadImg()}>
                            Share
                        </Button>
                    </div>
                </Box>
            </Container>


        </div>
    )
}


/**
 * Server side will give a signature for auth... (OPTION-2)
 * 
 */

async function getSignature() {

    const signResponse = await fetch('/sign/');
    const signData = await signResponse.json();

    const { signature, timestamp } = signData;
    return { signature, timestamp };
}