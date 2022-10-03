const { Schema, model, Types, isObjectIdOrHexString } = require("mongoose");
const moment = require("moment");

const ReactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    max: 280,
  },
  username: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (date) => {
      //use moment to format all new dates
      moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
    },
  },
});

const ThoughtSchema = new Schema(
  {
    thoughtText: { type: String, required: true, min: 1, max: 128 },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        //use moment to format all new dates
        moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
      },
    },
    username: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reactions: [ReactionSchema],
  },
  { toJSON: { virtuals: true, getters: true }, id: false }
);
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});
const Thoughts = model("Thoughts", ThoughtSchema);
module.exports = Thoughts;
