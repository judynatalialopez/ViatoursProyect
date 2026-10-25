const jwt=require('jsonwebtoken')
const httpError=require('../utils/httpError')
module.exports=(req,res,next)=>{const token=req.cookies.viatours_token||req.headers.authorization?.replace(/^Bearer\s+/i,'');if(!token)return next(httpError(401,'No autorizado'));try{req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch{return next(httpError(401,'Sesión inválida o expirada'))}}
