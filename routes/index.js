const express = require("express"); // фрейм для node.js
const router = express.Router(); // обєкт для роботи маршрутів

const multer = require("multer"); //це бібліотека, яка допомагає приймати файли, що завантажуються клієнтом через HTTP-запит (наприклад, через форму на веб-сторінці).
const UserController = require("../controllers/user-controller");
const authenticateToken = require("../middleware/auth");
const {
  PostController,
  CommentController,
  LikeController,
  FollowController,
} = require("../controllers");

const uploadDestination = "uploads";
// показуємо  де зберігати файли

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname); //
  },
});

const uploads = multer({ storage: storage }); //
// route user
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.current);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.put("/users/:id", authenticateToken, UserController.updateUser);

// routes posts

router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPost);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

// router comments

router.post("/comments", authenticateToken, CommentController.createComment);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentController.deleteComment
);

// like router

router.post("/likes", authenticateToken, LikeController.likePost);
router.delete("/likes/:id", authenticateToken, LikeController.unlikePost);

// follow router
router.post("/follow", authenticateToken, FollowController.followUser);
router.delete("/unfollow", authenticateToken, FollowController.unFollowUser);
module.exports = router;
