import React from 'react'
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div>
        <h1 style={{textAlign: "center", marginTop:" 55px"}}>404 - Page Not Found</h1>
        <div style={{textAlign: "center", marginTop:" 55px"}} >
        <h2 style={{textAlign: "center", marginBottom:" 30px"}}> You are wandering off the right path </h2>
        <Link style={{fontSize:"30px"}} to="/">
          Go Home
        </Link>
        </div>
        <img style={{    display: "block", marginLeft: "auto",marginRight: "auto",width: "70%"}} 
        src={'https://res.cloudinary.com/dzy0uevma/image/upload/v1632843260/ssdq61u6bsa8yx6x3syf.png'} ></img>

      </div>
    )
}
