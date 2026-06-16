import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors({
	origin: process.env.CLIENT_URL,
	credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
	const frontendDist = path.join(__dirname, "../frontend/dist");
	app.use(express.static(frontendDist));
	app.get("/{*splat}", (req, res) => {
		res.sendFile(path.join(frontendDist, "index.html"));
	});
}

// Connexion DB (avec cache pour les cold starts serverless)
connectDB();

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
});

export default app;
