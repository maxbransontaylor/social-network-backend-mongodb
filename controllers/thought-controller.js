const { User, Thought } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .populate("username")
      .populate("reactions")
      .select("-__v")
      .then((thoughtData) => {
        res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  createThought({ body }, res) {
    //redefine userId as username so that the Thought is created properly
    const thoughtObj = { thoughtText: body.thoughtText, username: body.userId };
    Thought.create(thoughtObj)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
          .populate("thoughts")
          .select("-__v");
      })
      .then((newThought) => res.json(newThought))
      .catch((err) => {
        console.log(err);
      });
  },
  getSingleThought({ params }, res) {
    Thought.find({ _id: params.thoughtId })
      .populate("username", "reactions")
      .select("-__v")
      .then((thoughtData) => {
        res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  updateThought({ body, params }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
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
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deletedData) => {
        if (!deletedData) {
          res.json({ message: "none found with this id" });
        }
        res.json({ deleted: deletedData });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
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
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
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
};
module.exports = thoughtController;
