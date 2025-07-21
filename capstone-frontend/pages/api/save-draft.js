import mongoose from 'mongoose';
import Draft from 'models/draftModel'; // Make sure this path is correct

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, examId, userAnswerData, timestamp } = req.body;

    try {
      // Connect to MongoDB
      await mongoose.connect("mongodb://localhost:27017/User-Drafts", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // Upsert the draft (insert or update if it already exists)
      const draft = await Draft.findOneAndUpdate(
        { userId, examId },   // Query to find existing draft
        { userId, examId, answerData: userAnswerData, timestamp },   // Data to insert/update
        { upsert: true, new: true }   // Insert new if it doesn't exist, return updated document
      );

      res.status(200).json({ message: 'Draft saved successfully', draft });
    } catch (error) {
      console.error('Error saving draft:', error);
      res.status(500).json({ message: 'Failed to save draft', error: error.message || error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
