import { useState, useEffect } from "react";

//material ui
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Skeleton from "@material-ui/lab/Skeleton";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from '@material-ui/lab/';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Explore, People } from "@material-ui/icons";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import { logoutSuccess } from "../../redux/actions/authActions";
import { returnErrors } from "../../redux/actions/errorActions";

import Modal from 'react-modal';

import axios from "axios";

import Fuse from 'fuse.js'
import { axiosInstance } from "../../config";

/**
 * Matrail ui Styles
 */

const useStyles = makeStyles((theme) => ({
    toolbar: {

        display: "flex",
        justifyContent: "start",
        background: "white",
        justifyContent: "center",

        [theme.breakpoints.down("1000")]: {
            justifyContent: "space-between",
        }

    },
    topbarLeft: {
        marginLeft: "0%",
        [theme.breakpoints.down("1250")]: {
            marginLeft: "50%",
        },
    },
    titleLg: {
        fontWeight: "500",
        fontSize: "30px",
        display: "none",
        color: "#ff0c00",
        fontFamily: "Lobster",
        [theme.breakpoints.up("sm")]: {
            display: "block",
            cursor: "pointer"

        }
    },
    titleSm: {
        fontSize: "20px",
        color: "#ff0c00",
        fontFamily: "Lobster",
        display: "block",
        cursor: "pointer",


        [theme.breakpoints.up("sm")]: {
            display: "none",
        }
    },



    search: {
        marginRight: "15%",
        marginLeft: "8%",
        display: "flex",
        alignItems: "center",
        background: "white",
        borderRadius: "30px",
        width: 500,

        borderRadius: "5px",
        [theme.breakpoints.down("1000")]: {
            width: 350,
            marginRight: "0%",
        },
        [theme.breakpoints.down("700")]: {
            width: 300,

        },

        [theme.breakpoints.down("xs")]: {
            width: 200,
            marginLeft: "10%",
            display: (props) => (props.open ? "flex" : "none"),
        },
        [theme.breakpoints.down("410")]: {
            width: 150,
            marginLeft: "10%",
            display: (props) => (props.open ? "flex" : "none"),
        }
    },
    searchIcon: {
        cursor: "pointer",
        padding: "3px",
        color: "black",
        alignItems: "center",
        paddingTop: "inherit",

    },
    input: { marginLeft: "5px" },
    user: {
        display: "flex",
        alignItems: "center",
        marginRight: "50px",
        [theme.breakpoints.down("1250")]: {
            marginRight: "0px",
        },

    },
    badge: {
        cursor: "pointer",
        marginRight: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            display: (props) => (props.open ? "none" : "flex"),
            marginTop: "auto",
            marginRight: theme.spacing(2),
        }
    },
    avatar: {
        cursor: "pointer",
        marginLeft: theme.spacing(2),
        width: theme.spacing(5),
        height: theme.spacing(5),

    },
    customBadge: {
        cursor: "pointer",
        backgroundColor: "#00AFD7",
        color: "white",
    },
    customBadgeMessage: {
        cursor: "pointer",
        backgroundColor: "#ff0c00",
        color: "white",
    },
    searchButton: {
        cursor: "pointer",
        display: "none",
        [theme.breakpoints.down("xs")]: {
            display: (props) => (props.open ? "none" : "flex"),
            border: "solid",
            borderRadius: " 50%",
            borderTop: "dotted",
            borderWidth: "2px",
        }
    },
    cancel: {
        cursor: "pointer",
        display: "none",
        [theme.breakpoints.down("xs")]: {
            display: (props) => (props.open ? "flex" : "none"),
            marginLeft: "20px"
        }
    },
    typography: {
        padding: theme.spacing(2),
    },
}));


/**
 * Modal Styles
 */


const customStyles = {
    content: {
        height: '65%',
        width: '80%',
        top: '15%',
        left: '15%',

    },
};



export default function Topbar() {

    const [open, setOpen] = useState(false);
    const classes = useStyles({ open });
    let history = useHistory();
    const user = useSelector((state) => state.auth);
    const posts = useSelector((state) => state.allPosts.posts);
    const loggedUser = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [userImg, setUserImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [wordsSreach, setWordsSreach] = useState("");
    const [emptyAuto, setEmptyAuto] = useState([])
    const [friends, setFriends] = useState([])






    useEffect(() => {
        const getFriends = async () => {
            const usersend = { id: loggedUser.user }
            try {
                let payload = { id: loggedUser.user };
                await axiosInstance.get("/users/friends/" + loggedUser.user, payload).then(res => {
                    setFriends(res.data);
                })
            } catch (err) {
                console.log(err)
                dispatch(returnErrors(err.response));
            }
        }
        if (loggedUser.user == null) {
            return
        }
        getFriends();
    }, [loggedUser.user])





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

/**
 * check if the token expired
 */

    useEffect(() => {
        if(loggedUser.user){
            axiosInstance.get("/users/getuser/auth/" + loggedUser.user,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
           .catch(err => {
                console.log(err)
                dispatch(returnErrors(err.response));
                logout();
            })
        } }, )



   


 


    function userProfile() {
        history.push(`/profile/` + user.user);
        history.go()
    }

    function ChangePassword() {
        history.push("/reset");
        history.go()
    }

    function backHome() {
        if (window.location.pathname === "/") {
            window.location.reload();
        }
        history.push("/");
    }

    function logout() {
        dispatch(logoutSuccess());
        history.push("/user/login");
    }

    const toExplore = () => {
        history.push(`/category/all`);
        history.go()

    }


    /**
     * Modal
     * 
     */


    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);

    }


    /**
     * Popup  options
     * 
     */


    const [anchorEl, setAnchorEl] = useState(null);

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
            >
                <MenuItem onClick={userProfile}><AccountCircleIcon /> Profile</MenuItem>
                <MenuItem onClick={toExplore}><Explore /> Explore</MenuItem>
                <MenuItem onClick={() => openModal()}><People /> Friends</MenuItem>
                <MenuItem />
                <MenuItem onClick={ChangePassword}><LockOpenIcon /> Reset Password</MenuItem>
                <MenuItem onClick={logout}><ExitToAppIcon /> Logout</MenuItem>
            </Menu>
        )
    }


    /**
     * fuzzy-search
     */

    const fuse = new Fuse(posts, {
        keys: [
            'title',
            'descriptiom'
        ],
        includeScore: true
    })

    const results = fuse.search(wordsSreach)


    /**
     * Filter for search
     */

    const OPTIONS_LIMIT = 5;
    const defaultFilterOptions = createFilterOptions();

    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
    };



    function navSearchPage(text) {
        history.push(`/searchpage/` + text);
        history.go()
    }



    return (
        <AppBar position="fixed">
            <Toolbar className={classes.toolbar}>
                <Link to="/" onClick={() => backHome()} style={{ textDecoration: "none" }}>
                    <div className={classes.topbarLeft} >
                        <Typography className={classes.titleLg}>
                            Sharing
                        </Typography>
                        <Typography className={classes.titleSm}>
                            Sharing
                        </Typography>
                    </div>
                </Link>

                <div>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <HighlightOffIcon fontSize='large' onClick={closeModal} style={{ float: "right", cursor: "pointer" }} />
                        <div>
                            <h2>Friends</h2>
                            {friends.map((friend, index) => (
                                <div key={index}>
                                    <ListItem className={classes.followersIcons} >
                                        <ListItemAvatar>
                                            <Avatar src={friend.img} onClick={() => { userProfile(friend._id) }} style={{ cursor: "pointer" }}  />
                                        </ListItemAvatar>
                                        <ListItemText className={classes.followingText} primary={friend.username} secondary="" />
                                    </ListItem>
                                </div>
                            ))}

                        </div>
                    </Modal>
                </div>


                <div className={classes.search}>
                    <Autocomplete
                        filterOptions={filterOptions}
                        id="free-solo-demo"
                        freeSolo
                        onChange={(e, value) => navSearchPage(value)}
                        autoHighlight

                        options={emptyAuto.map((option) => option.title )}
                        renderInput={(params) => (
                            // <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                            <TextField className={classes.search}
                                {...params}
                                onKeyDown={(e, value) => {
                                    if (e.key === 'Enter') {
                                        navSearchPage(value);
                                    }
                                }}
                                placeholder="Search" margin="normal" variant="outlined"
                            />
                        )}
                    />
                </div>

                <CancelTwoToneIcon className={classes.cancel} onClick={() => setOpen(false)} color="action" />

                <div>
                    <SearchIcon
                        className={classes.searchButton}
                        onClick={() => setOpen(true)}
                        color="secondary"
                    />
                </div>
            
                {user.user !== null ?
                    <div className={classes.user}>

                        {loading ? (
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        ) : (

                            <Avatar className={classes.avatar}
                                src={userImg} onClick={handleClick} aria-controls="simple-menu" aria-haspopup="true"
                            />
                        )
                        }
                        {popup()}

                    </div>
                    : <Button variant="contained" color="secondary" onClick={() => logout()} >Login</Button>}
            </Toolbar>
        </AppBar>
    )
}
