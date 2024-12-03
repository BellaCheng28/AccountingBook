import express from "express";
const router = express.Router();
import User from "../models/user.js";

//get all users
router.get("/",async(req,res)=>{
  try{
    const users = await User.find({});
    res.render("users/index.ejs", {
      users,
      currentUser: req.session.user,
    });
  }catch(error){
    console.log(error);
    res.status(418).redirect("/")
  }
})



//get personal accounting book
router.get("/:id/personal-books", async(req,res)=>{
  try { 
     const user = await User.findById(req.params.id).populate("personalBooks");
      if(!user)return res.status(404).send("User not found")
         const personalBooks = user.personalBooks;
      res.render("accountingbooks/personal.ejs",{user,personalBooks})
     console.log(user.personalBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving personal book')
  }
})


//get share accounting books

router.get("/:id/shared-books",async(req,res)=>{
  try { 
 const user = await User.findById(req.params.id).populate("sharedBooks");
  if(!user) return res.status(404).send("User not found")
    const sharedBooks =user.sharedBooks;
  console.log("Shared Books for austin:", sharedBooks);

    res.render("accountingbooks/shared.ejs",{user,sharedBooks});
   
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving shared books");
  }
 
})

























export default router;