import mongoose from "mongoose";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/pressureguard";
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    console.log(`[db] connected → ${uri}`);
  } catch (err) {
    console.error("[db] connection error:", err.message);
    process.exit(1);
  }
}
