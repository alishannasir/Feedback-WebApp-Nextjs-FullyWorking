import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected.");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "");
    connection.isConnected = db.connection.readyState;
    console.log("DB is connected.");
  } catch (error) {
    console.log("Not connected.", error);
    process.exit(1); // Exit with a non-zero status code
  }
}
// re_VzZy99RQ_P7tKpJRRz73NGo8JrV5zGXLm
export default dbConnect;
