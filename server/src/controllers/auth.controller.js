const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const db=require('../config/db')
const httpError=require('../utils/httpError')
const login=async(req,res)=>{const email=String(req.body.email||'').trim().toLowerCase();const password=String(req.body.password||'');if(!email||!password)throw httpError(400,'Correo y contraseña son obligatorios');const[[user]]=await db.query('SELECT id,name,email,password_hash,active FROM users WHERE email=? LIMIT 1',[email]);if(!user||!user.active||!(await bcrypt.compare(password,user.password_hash)))throw httpError(401,'Credenciales inválidas');const token=jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'8h'});res.cookie('viatours_token',token,{httpOnly:true,sameSite:process.env.NODE_ENV==='production'?'none':'lax',secure:process.env.NODE_ENV==='production',maxAge:28800000});res.json({user:{id:user.id,name:user.name,email:user.email}})}
const me=async(req,res)=>{const[[user]]=await db.query('SELECT id,name,email FROM users WHERE id=? AND active=1 LIMIT 1',[req.user.id]);if(!user)throw httpError(401,'Usuario no disponible');res.json({user})}
const logout=async(req,res)=>{res.clearCookie('viatours_token',{httpOnly:true,sameSite:process.env.NODE_ENV==='production'?'none':'lax',secure:process.env.NODE_ENV==='production'});res.status(204).end()}
module.exports={login,me,logout}
