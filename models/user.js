import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose); // This will add to our schema a field for password, username, additional methods we can use, etc.

const User = mongoose.model("User", UserSchema);

export default User;
