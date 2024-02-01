export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
