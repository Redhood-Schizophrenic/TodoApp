import mongoose from "mongoose";
import StringValidators from "../utils/StringValidator";

export const TodosSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    validate: {
      validator: (value) => StringValidators(value),
      message: "Title should not contain invalid characters like /, \\, \", ;, ', +, `, or ^"
    }
  },
  Description: {
    type: String,
    required: false,
  },
  Completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Todos; 
