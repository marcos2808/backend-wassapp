import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: false
  },
  profileImage: {
    type: String,
    required: false,
    unique: false
  },
  deleted: {
    type: Boolean,
    default: false,
    unique: false
  }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  let match = await bcrypt.compare(password, this.password);
  return match;
}

userSchema.methods.compareEmail = async function(email) {
  if (email === this.email) return true;
  else return false;
}

const User = mongoose.model("User", userSchema);

export default User;