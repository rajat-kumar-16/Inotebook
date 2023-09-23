const mongoose= require('mongoose');
const mongoURI= "mongodb://127.0.0.1/inotebook";

const connectToMongo = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    }
};
module.exports=connectToMongo;