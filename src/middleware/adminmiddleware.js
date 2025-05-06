

const adminmiddleware = async(req,res,next){
    try {
        if (req.user.role != "admin") {
          throw new Error("Only admin have access to create a Problem");
        }}catch(err){
            res.status(400).send('Only admins have access')
        }
}

module.exports=adminmiddleware;