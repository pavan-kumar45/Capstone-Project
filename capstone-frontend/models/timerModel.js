import mongoose from "mongoose";

const TimerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  examId: { type: String, required: true },
  remainingTime: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    seconds: { type: Number, required: true },
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Timer || mongoose.model("Timer", TimerSchema);
