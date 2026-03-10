const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    console.error('PLEASE CHECK YOUR MONGODB ATLAS NETWORK ACCESS IP WHITELIST');
    // process.exit(1); // Keep server running to allow debugging other endpoints if needed, though DB calls will fail
  }
};

module.exports = connectDB;
