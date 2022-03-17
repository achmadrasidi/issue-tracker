const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const issueSchema = new mongoose.Schema(
  {
    project: {
      type: String,
      default: "",
    },
    assigned_to: {
      type: String,
      default: "",
    },
    status_text: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: true,
    },
    issue_title: {
      type: String,
      require: true,
      default: "",
    },
    issue_text: {
      type: String,
      require: true,
      default: "",
    },
    created_by: {
      type: String,
      require: true,
      default: "",
    },
    created_on: {
      type: Date,
      require: true,
      default: "",
    },
    updated_on: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Issues = mongoose.model("Issues", issueSchema);

module.exports = Issues;
