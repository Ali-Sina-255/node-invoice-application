import mongoose from "mongoose";
const { Schema } = mongoose;

const VerifyResetTokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true, // fix typo: was 'require'
  },
  createdAt: {
    type: Date, // ✅ Correct type
    required: true,
    default: Date.now, // ✅ pass the function, not Date.now()
    expires: 900, // ✅ token will auto-delete after 900 seconds (15 min)
  },
});

const VerifyResetToken = mongoose.model(
  "VerifyResetToken",
  VerifyResetTokenSchema,
);

export default VerifyResetToken;
