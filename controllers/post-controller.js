const { prisma } = require("../prisma/prisma-client");

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body; // текст поста

    const authorId = req.user.userId; // id користувача який створює пост
    if (!content) {
      return res.status(400).json({ error: "всі поля обовязкові" });
    }

    try {
      const post = await prisma.post.create({
        data: {
          content,
          authorId,
        },
      });
      res.json(post);
    } catch (error) {
      console.error("create post error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllPost: async (req, res) => {
    const userId = req.user.userId;

    try {
      const posts = await prisma.post.findMany({
        include: {
          Likes: true,
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const postWithLikeInfo = posts.map((post) => ({
        ...post,
        likedByUser: post.Likes.some((like) => like.userId === userId),
      }));

      res.json(postWithLikeInfo);
    } catch (error) {
      console.error("get all post error", error);
      res.status(500).json({ error: "Iternal server error" });
    }
  },
  getPostById: async (req, res) => {
    const { id } = req.params;

    const userId = req.user.userId;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          comments: {
            include: {
              user: true,
            },
          },
          Likes: true,
          author: true,
        }, // Include related posts
      });

      if (!post) {
        return res.status(404).json({ error: "пост не знайдений" });
      }

      const postWithLikeInfo = {
        ...post,
        likedByUser: post.Likes.some((like) => like.userId === userId),
      };
    
      res.json(postWithLikeInfo);
    } catch (error) {
      res.status(500).json({ error: "помилка поста" });
    }
  },
  deletePost: async (req, res) => {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ error: "пост не знайдений" });
    }

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({ error: "немає доступу" });
    }

    try {
      const transaction = await prisma.$transaction([
        // транзакція це група операцій яка виконується як одне ціле
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.like.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } }),
      ]);

      res.json(transaction);
    } catch (error) {
      console.error("Delete post error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = PostController;
