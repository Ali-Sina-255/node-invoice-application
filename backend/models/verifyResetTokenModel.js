import mongoose from "mongoose";
const { Schema } = mongoose;

const VerifyResetTokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, require: true },
  createAT: {
    type: date,
    required: true,
    default: Date.now(),
    expire: 900,
  },
});

const VerifyResetToken = mongoose.model(
  "VerifyResetToken",
  VerifyResetTokenSchema
);

export default VerifyResetToken;
