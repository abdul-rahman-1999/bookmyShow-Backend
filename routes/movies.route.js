import express from 'express'
import {auth} from "../middleware/auth.js"
import nodemailer from "nodemailer"
import {
    getMoviesbyId,
    getMovies,
    updateMoviesbyId,
    addMoviesbyId,
    DeleteMovies,
    //  getTheatersbyId,
} from '../services/movies.service.js'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const router = express.Router()


router.get('/movies', auth,  async function(request,response){
    const result = await getMovies()
     response.send(result);
   })


   router.get('/movies/:id', auth,  async function(request,response){
    const {id} = request.params;
    const result = await getMoviesbyId(id)
     response.send(result);
   })

   router.put('/movies/:id', auth, async function(request,response){
    const {id} = request.params;
    const data = request.body;
    const result = await updateMoviesbyId(id, data)
     response.send(result);
   })

router.post("/add/movies", auth, async function(request,response){
const data = request.body
const result = await addMoviesbyId(data)
response.send(result)
})

router.delete("/movies/:id", auth, async function (request, response) {
  const { id } = request.params;
  const result = await DeleteMovies(id);
  console.log(result);
  result.deletedCount > 0 ? response.send({msg:'Movie was deleted successfully'}) : response.status(404).send({ msg: "MovieNot Found" });
});

  router.post("/movies/queries", auth, async function(request,response){
    const{email,query} = request.body;

    try{
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
          user:process.env.EMAIL,
          pass:process.env.PASSWORD,
        }
      })

       const mailOptions = {
        from:email,
        to:process.env.EMAIL,
        subject:"Sending Mail Regarding Queries",
        text:query
       }

       transporter.sendMail(mailOptions,(error,info) => {
        if(error){
          console.log("error",error)
        }else{
          console.log('Email Sent Successfully', info.response)
          response.status(201).json({status:201,info})
        }
       })

    }catch(error){
      response.status(201).json({status:401,error})
    }
  })


  router.post("/movies/:id", async function(request,response){
    let {id} = request.params;
    let {email} = request.body
    const result = await getMoviesbyId(id)
    console.log(result)
    if(result){
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
          user:process.env.EMAIL,
          pass:process.env.PASSWORD,
        }
      })

       const mailOptions = {
        from:process.env.EMAIL,
        to:email,
        subject:"Sending Mail Regarding Tickets",
        text:`You Booked a Ticket for ${result.name} at ${result.theaters[0].theatername} and the time is ${result.shows[0].show}`
       }

       transporter.sendMail(mailOptions,(error,info) => {
        if(error){
          console.log("error",error)
        }else{
          console.log('Email Sent Successfully', info.response)
          response.status(201).json({status:201,info})
        }
       })

    }else{
      response.status(201).json({status:401,error})
    }
  })
  

export default router
