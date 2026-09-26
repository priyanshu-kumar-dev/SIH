const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["Hindi", "English"],
      default: "Hindi",
    },

    level: {
      type: String,
      default: "Beginner",
    },

    duration: {
      type: String,
      default: "10 min",
    },

    icon: {
      type: String,
      default: "📚",
    },

    description: {
      type: String,
      required: true,
    },

    points: [
      {
        type: String,
      },
    ],

    isOfflineAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);