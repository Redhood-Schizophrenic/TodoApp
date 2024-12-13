import mongoose from "mongoose";
import StringValidators from "../utils/StringValidator";
import bcrypt from "bcryptjs";

export const UsersSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: StringValidators,
        message: "Invalid characters in email"
      }
    },
    Password: {
      type: String,
      required: true,
      minlength: 6,
    },
    SaltPassword: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

UsersSchema.methods.authenticate = async function(plainText) {
  return bcrypt.compare(plainText, this.Password);
};

UsersSchema.pre("save", async function(next) {
  try {
    if (this.isModified("Password")) {
      const salt = await bcrypt.genSalt(10);
      this.Password = await bcrypt.hash(this.Password, salt);
      this.SaltPassword = salt;
    }
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

export default mongoose.models.Users;
