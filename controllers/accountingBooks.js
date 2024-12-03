// controllers/recipes.js
import express from "express";
import AccountingBook from "../models/acountingBook.js";
import User from "../models/user.js";;

const router = express.Router();
 
// the owner books(No matter if shareWith or not) 
router.get("/", async (req, res) => {
  try {
    
    res.render("accountingbooks/index.ejs", {
      currentUser: req.session.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving books");
  }
});


//get personal books list
router.get("/personal-books",async(req,res)=>{
try {
  
  console.log("Session:", req.session);

 const userId = req.session.user._id;

  const personalBooks = await AccountingBook.find({
    owner: userId,
    sharedWith: { $size: 0 },
  }).exec();
  console.log("Personal books query result:", personalBooks);
  


  res.render("accountingbooks/personal.ejs",{
    user:req.session.user,
    personalBooks,
  });
  
} catch (error) {
   console.error(error);
   res.status(500).send("Error retriebing personal books");
}
})



// get all shared books list
router.get("/shared-books", async (req, res) => {
  try {
      
    const userId = req.session.user._id;
      console.log("Looking for shared books for userId:", userId);
    const sharedBooks = await AccountingBook.find({
      //  "sharedWith.userId": userId
      "sharedWith": { $elemMatch: { userId: userId } },
    });
    console.log("Found shared books:", sharedBooks);
    if(sharedBooks.length === 0){
      console.log("No shared books found");
    }
  res.render("accountingbooks/shared.ejs", {
    user: req.session.user,
    sharedBooks,
  });
    
    // res.render("accountingbooks/shared.ejs", { sharedBooks:sharedBooks.length>0?sharedBooks:null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retriebing shared books");
  }
});




//get create accountingbook form
router.get('/new',(req,res)=>{
    res.render("accountingbooks/new.ejs");
});

//creat accountbook

router.post("/new",async(req,res)=>{
   try {
     //console.log("Request Body:", req.body);
     const { name, isShared } = req.body;
       const userId = req.session.user._id;
     //to get accountingbook name and the type
     //create newbook
     const newBook = new AccountingBook({
       name,
       owner:userId,
       isShared: isShared ==="on",
     });
    
     //update user models
     const user = await User.findById(userId);
    
      if (!user) {
        return res.status(404).send("User not found.");
      }
        
     //add sharedWith list
     if (isShared === "on") {
      newBook.sharedWith.push({
        userId:userId,
        permission:"write",
      });
       user.sharedBooks.push(newBook._id);
     }else{
     
       user.personalBooks.push(newBook._id);
     }
       await newBook.save(); //save 
       await user.save();

      



if(isShared ==="on"){
 return res.redirect(`/users/${req.session.user._id}/shared-books`);
} 
  res.redirect(`/users/${req.session.user._id}/personal-books`);


   } catch (error) {
    console.error(error)
    res.status(500).send('Error for create new accountbook')
   }
});

router.delete('/:id',async(req,res)=>{
try {

  const {isShared } = req.body;
 //delete accountingbook
 const book = await AccountingBook.findByIdAndDelete(req.params.id);
 if(!book){
    return res.status(404).send("accoutning books not found")
 }

//delete and update user accountingbook
const user =await User.findById(book.owner);
if(!user){
    res.status(404).send('User not found');
}
user.personalBooks = user.personalBooks.filter(bookId => !bookId.equals(req.params.id));
user.sharedBooks = user.sharedBooks.filter(bookId => !bookId.equals(req.params.id));

//after filter personalBooks/sharedBooks. save()   
await user.save();

 if (isShared === "on") {
   res.redirect(`/users/${req.session.user._id}/shared-books`);
 } else {
   res.redirect(`/users/${req.session.user._id}/personal-books`);
 }
 
} catch (error) {
    console.error(error);
    res.status(500).send('Erro deleting the accounting book');
    
}

})



//allow family to read write delete

router.get("/:id/edit",async(req,res)=>{
    try { 
     
       const bookId =req.params.id;
       const userId = req.session.user._id;
        //find book and to check if the user have access to this book
 const book = await AccountingBook.findOne({
   _id: bookId,
   $or: [
     { owner: userId },
     {
       "sharedWith": {
         $elemMatch: { userId: userId, permission: "write" },
       },
     },
   ],
 })
.populate("sharedWith.userId","username")
.exec();
 console.log(book);
//  console.log("User ID:", userId);
//  console.log("Book ID:", bookId);
 if(!book){
    return res.status(403).send("you do not access to this book.")
 }
 
  res.render("accountingbooks/edit.ejs", {
    book,
    currentUser: req.session.user,
  });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving book details");
    }
});




router.put("/:id",async(req,res)=>{
    try {
      const bookId = req.params.id;
      const userId = req.session.user._id;
      //find book and access to this book (owner and sharedWith)
      const book = await AccountingBook.findOne({
        _id: bookId,
        $or: [
          { owner: userId },
          {
            sharedWith: {
              $elemMatch: { userId: userId, permission: "write" },
            },
          },
        ],
      });
      if (!book) {
        return res
          .status(403)
          .send("you do not have write access to this book. ");
      }
       
      const { name, share } = req.body;

      //update book name
      if (name) book.name = name;

      // deal with shareWith
      // if (typeof share !== "undefined") {
        // book.isShared = isShared === "on";
        if(share === "on"){

          // if(book.sharedWith.length === 0){

          // }
        }else{
          book.sharedWith = [];
          book.isShared = false;
        }
      // }
      //save book
      await book.save();
      console.log(book.name)

      if(share === "on"){
        return res.redirect(`/users/${req.session.user._id}/shared-books`);
      } else{
        res.redirect(`/users/${req.session.user._id}/personal-books`);
      }
       
    } catch (error) {
         console.error(error);
         res.status(500).send("Error updating book entries");
    }
})


router.get("/:id/share",async(req,res)=>{
    try {
        const bookId = req.params.id;
        const userId = req.session.user._id;
    
        const book = await AccountingBook.findOne({
          _id: bookId,
          $or: [{ owner: userId }, { "sharedWith.userId": userId }],
        }).populate("owner sharedWith.userId", "username");
   if(!book){
    return res.status(403).send("you do not have access to this book.");
    
   }
    res.render("accountingbooks/show.ejs", { book, user: req.session.user });


    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting the book.");
    }
})

router.post("/:id/share", async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.session.user._id;
    const { familyMemberId, permission } = req.body;

    // 查找账簿
    const book = await AccountingBook.findOne({ _id: bookId, owner: userId });
    if (!book) {
      return res.status(403).send("You do not have access to share this book.");
    }

    // 检查家人是否已经在共享列表中
    const alreadyShared = book.sharedWith.some(
      (shared) => shared.userId.toString() === familyMemberId
    );

    if (alreadyShared) {
      return res.status(400).send("This user is already shared this book.");
    }

    // 添加共享成员
    book.sharedWith.push({
      userId: familyMemberId,
      permission: permission || "read", // 默认权限为"read"
    });

    await book.save();
    res.redirect(`/accountingbooks/${bookId}/edit`); // 重定向到编辑页面
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sharing the book.");
  }
});


router.put("/:bookId/update-share", async (req, res) => {
  try {
    const { bookId, familyMemberId, newPermission } = req.body;
    const userId = req.session.user._id;

    // 查找账簿并确保当前用户是所有者
    const book = await AccountingBook.findOne({
      _id: bookId,
      owner: userId,
    });

    if (!book) {
      return res
        .status(403)
        .send("You do not have access to modify this book.");
    }

    // 更新共享成员的权限
    const sharedUser = book.sharedWith.find(
      (shared) => shared.userId.toString() === familyMemberId
    );

    if (!sharedUser) {
      return res.status(404).send("User not found in shared list.");
    }

    sharedUser.permission = newPermission; // 更新权限
    await book.save();

    res.redirect(`/accountingbooks/${bookId}/edit`); // 重定向到编辑页面
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating share permissions.");
  }
});










export default router;
