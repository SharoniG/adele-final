import Counter from '../models/counterModel.js';

export const getNextSequence = async (sequenceName) => {
  const updated = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return updated.sequence_value;
};


// יצירת מספר רץ , בשימוש בעת יצירת פריט