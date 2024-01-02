const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    userEmail: {
      type: String,
      required: true,
    },
    jobName: {
      type: String,
      required: true,
    },
    jobCategory: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobDuration: {
      type: String,
    },
    price: {
      type: Schema.Types.Decimal128,
    },
    keywords: {
      type: [String],
      default: [],
      lowercase: true,
    },
    datePosted: {
      type: Date,
      default: Date.now,
      required: true,
    },
  });
  
jobSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.price = ret.price.toString();
    return ret;
  },
});

jobSchema.pre("save", function (next) {
  if (this.isModified("keywords")) {
    this.keywords = this.keywords.map((keyword) => keyword.toLowerCase());
  }
  next();
});
  
module.exports = mongoose.model('Jobs', jobSchema);