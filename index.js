import express from 'express'
import 'dotenv/config'
const app = express()
import logger from "./logger.js";
import morgan from "morgan";

const port =process.env.PORT|| 4000
app.use(express.json())
const morganFormat = ":method :url :status :response-time ms";


app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let carData=[]
let nextId=1
//add a new car
app.post('/cars',(req,res)=>{
   const{name,price}= req.body
   const newCar={id:nextId++,name,price}
   carData.push(newCar)
   res.status(200).send(newCar)
})
//get all cars
app.get('/cars',(req,res)=>{
    res.status(200).send(carData)
})
//get car by id
app.get('/cars/:id',(req,res)=>{
    const car=carData.find(c=>c.id===parseInt(req.params.id))
   if(!car){
    res.status(404).send("car not found")
   } 
   res.status(200).send(car)
})
//update car
app.put('/cars/:id',(req,res)=>{
    const car=carData.find(c=>c.id===parseInt(req.params.id.trim()))
   if(!car){
    res.status(404).send("car not found")
   } 
   const {name ,price}=req.body
   car.name=name
   car.price=price
   res.status(200).send(car)
})
app.delete('/cars/:id',(req,res)=>{
    const index=carData.findIndex(c=>c.id===parseInt(req.params.id))
    if(index===-1){
   return res.status(404).send("car not found")
   } 
   carData.splice(index,1)
   res.status(200).send("car entry deleted")
})
app.listen(port ,()=>{
    console.log(`server is listening at port:${port}`)
})

