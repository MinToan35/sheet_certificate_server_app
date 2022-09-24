const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    items: {
      type: Array,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    edit: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("posts", postSchema);
