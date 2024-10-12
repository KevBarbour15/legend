import mongoose, { Connection } from "mongoose";

let cachedConnection: Connection | null = null;
let isConnecting = false;

export async function connectToMongoDB(): Promise<Connection> {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  if (isConnecting) {
    // If a connection is in progress, wait for it to complete
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (cachedConnection) {
      return cachedConnection;
    }
  }

  try {
    isConnecting = true;
    if (mongoose.connection.readyState === 1) {
      cachedConnection = mongoose.connection;
      isConnecting = false;
      return cachedConnection;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = connection.connection;
    console.log("New MongoDB connection established");
    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  } finally {
    isConnecting = false;
  }
}
