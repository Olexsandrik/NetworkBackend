const { prisma } = require("../prisma/prisma-client");

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (followingId === userId) {
      return res
        .status(500)
        .json({ error: "ви не можете підписатися на самого себе" });
    }
    try {
      const existingSubscription = await prisma.follows.findFirst({
        // перевірка на існування підписок користувачів
        where: {
          AND: [{ followerId: userId }, { followingId: followingId }],
        },
      });
      if (existingSubscription) {
        return res.status(500).json({ error: "підписка вже існужє" });
      }

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      });

      res.status(201).json({ message: "підписка успішно створена" });
    } catch (error) {
      console.error("follow error", error);
      res.status(500).json({ error: "iternal server error" });
    }
  },
  unFollowUser: async (req, res) => {
    const { followingId } = req.params;
    const userId = req.user.userId;
    try {
      const follows = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId: followingId }],
        },
      });
      if (!follows) {
        return res.status(404).json({ error: "такої підписки не існує" });
      }

      await prisma.follows.delete({
        where: { id: follows.id },
      });
      return res.status(201).json({ error: "ви відписалися " });
    } catch (error) {
      console.error(error);
      return res.status(505).json({ error: "Internet server error" });
    }
  },
};

module.exports = FollowController;
