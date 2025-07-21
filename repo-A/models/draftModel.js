import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  examId: { type: String, required: true },
  answerData: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Draft = mongoose.models.Draft || mongoose.model('Draft', draftSchema);

export default Draft;
