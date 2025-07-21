import mongoose from "mongoose";

// MongoDB Connection String
const MONGODB_URI = "mongodb://localhost:27017/User-Drafts";

// Schema for Timer Model
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

// Define Model
const Timer = mongoose.models.Timer || mongoose.model("Timer", TimerSchema);

let isConnected = false; // Flag to track connection status

export default async function handler(req, res) {
  const { method } = req;

  // Direct MongoDB Connection
  if (!isConnected) {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("MongoDB Connected Directly.");
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
      return res.status(500).json({ success: false, error: "Database connection failed" });
    }
  }

  switch (method) {
    case "GET": // Fetch Timer State
    try {
      const { userId, examId } = req.query;
  
      if (!userId || !examId) {
        return res.status(400).json({ success: false, message: "Missing userId or examId" });
      }
  
      const timer = await Timer.findOne({ userId, examId });
  
      if (!timer) {
        return res.status(200).json({ success: false, message: "Timer not found", data: null });
      }
  
      res.status(200).json({ success: true, data: timer });
    } catch (error) {
      console.error("Error fetching timer state:", error);
      res.status(500).json({ success: false, error: "Failed to fetch timer state" });
    }
  

    case "POST": // Save Timer State
      try {
        const { userId, examId, remainingTime} = req.body;
        const timer = await Timer.findOneAndUpdate(
          { userId, examId },
          { remainingTime, updatedAt: new Date() },
          { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: timer });
      } catch (error) {
        console.error("Failed to save timer:", error);
        res.status(500).json({ success: false, error: "Failed to save timer" });
      }
      break;

    default:
      res.status(400).json({ success: false, error: "Invalid request method" });
      break;
  }
}
