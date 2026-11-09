require('dotenv').config({path:require('path').join(__dirname,'.env')})
const app=require('./src/app')
const port=Number(process.env.PORT||4000)
app.listen(port,()=>process.stdout.write(`API disponible en http://localhost:${port}\n`))
