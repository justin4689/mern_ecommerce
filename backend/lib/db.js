import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
	if (isConnected) return;
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		isConnected = true;
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};
