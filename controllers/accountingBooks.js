// controllers/recipes.js
import express from "express";
import AccountingBook from "../models/acountingBook.js";

const router = express.Router();
 
router.get("/",async(req,res)=>{
    try {
    const ownedBooks = await AccountingBook.find({owner:req.session.user._id});
    const sharedBooks = await AccountingBook.find({sharedWith:req.session.user._id});
    res.render("accountingbooks/idnex.ejs",{ownedBooks,sharedBooks});
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving  book");
        
    }
})







export default router;
