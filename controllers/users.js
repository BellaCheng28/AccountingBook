import express from "express";
const router = express.Router();
import User from "../models/user.js";

//get all users
router.get("/",async(req,res)=>{
  try{
    const users = await User.find({});
    res.render("users/index.ejs",{users});
  }catch(error){
    console.log(error);
    res.status(418).redirect("/")
  }
})

//get a user all accountingbooks
router.get('/:id',async(req, res) => {   
try {  
    const user =await User.findById(req.params.id).populate("accountingBooks");
    if (!user) {
        return res.status(404).send("User not found")
      }
        res.render("users/show.ejs",{user});  
} catch (error) {
    console.error(error);
    res.status(500).send("There was an error getting users");
    
};
});



//get personal accounting book
router.get("/:id/personal-books", async(req,res)=>{
  try {
     const user = await User.findById(req.params.id).populate("personalBooks");
      if(!user)return res.status(404).send("User not found")
      res.render("accountingbooks/personal.ejs",{user})
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
    res.render("accountingbooks/shared.ejs",{user});
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving shared books");
  }
 
})























export default router;