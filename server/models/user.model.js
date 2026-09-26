const  mongoose =require ("mongoose");
const validator =require( "validator");
const bcrypt =require ("bcrypt");
const crypto =require( "crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxlength: 50,
    },

    username: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      minlength: 6,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      validate: {
        validator: function (el) {
          if (this.authProvider === "google") {
            return true;
          }
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },

    phoneNumber: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      unique: true,
      sparse: true,
      trim: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      url: String,
      public_id: String,
    },

    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      select: false,
      index: true,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Remove sensitive data from JSON
// ==========================================

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;

    return ret;
  },
});

// ==========================================
// Password hashing
// ==========================================

userSchema.pre("save", async function (){
  if (!this.isModified("password")) {
    return ;
  }

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;

  // next();
});

// ==========================================
// Check password
// ==========================================

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

// ==========================================
// Check password changed after JWT
// ==========================================

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// ==========================================
// Password reset token
// ==========================================

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// ==========================================
// MODEL
// ==========================================

const User = mongoose.model("User", userSchema);

module.exports= User;