const jwt = require('jsonwebtoken');

const checkAuth = (req,res,next) =>{

try{
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message:"Auth failed"
        })
    }
    jwt.verify(token, process.env.JWT_KEY);

    next();

} catch(error){
    res.status(401).json({
        message:'Auth failed'.
        console.log(error)
    })
}


}

module.exports = checkAuth;
