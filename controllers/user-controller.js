const { User, Thought } = require("../models");

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate("friends", "thoughts")

      .select("-__v")
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  createUser({ body }, res) {
    User.create(body)
      .then((newUser) => res.json(newUser))
      .catch((err) => {
        console.log(err);
      });
  },
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((updatedData) => {
        if (!updatedData) {
          res.json({ message: "none found with this id" });
        }
        res.json(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((updatedData) => {
        if (!updatedData) {
          res.json({ message: "none found with this id" });
        }
        res.json(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getOneUser({ params }, res) {
    User.find({ _id: params.userId })
      .populate("friends", "thoughts")
      .select("-__v")
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  updateUser({ body, params }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((updatedData) => {
        if (!updatedData) {
          res.json({ message: "none found with this id" });
        }
        res.json(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((data) => {
        if (!data) {
          res.json({ message: "none found with this id" });
        }
        Thought.deleteMany({ _id: params.userId });
        res.json({ deleted: data });
      })
      .catch((err) => console.log(err));
  },
};

module.exports = userController;
