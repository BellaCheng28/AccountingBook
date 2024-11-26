const validSession = (req, res, next) => {
  console.log("Valid session check");
  console.log("Current session:", req.session);
  if (req.session && req.session.user) {
    next();
  } else {
    if (req.originalUrl === "/auth/sign-in") {
      return res.status(200).render("auth/sign-in.ejs");
    }
    res.redirect("/auth/sign-in");
  }
};

export default validSession;
