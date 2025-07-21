import mongoose from 'mongoose';
import Draft from 'models/draftModel';

export default async function handler(req, res) {
  const { userId, examId } = req.query;

  try {
    await mongoose.connect("mongodb://localhost:27017/User-Drafts");

    const draft = await Draft.findOne({ userId, examId });
    if (draft) {
      res.status(200).json(draft);
    } else {
      res.status(404).json({ message: 'No draft found' });
    }
  } catch (error) {
    console.error('Error fetching draft (inside get-draft.js):', error);
    res.status(500).json({ message: 'Failed to fetch draft', error: error.message || error });
  }
}
