import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import { redis } from "./lib/redis.js";

const users = [
	{
		name: "Admin",
		email: "admin@store.com",
		password: "admin123",
		role: "admin",
	},
	{
		name: "Alice Dupont",
		email: "alice@example.com",
		password: "customer123",
		role: "customer",
	},
	{
		name: "Bob Martin",
		email: "bob@example.com",
		password: "customer123",
		role: "customer",
	},
];

const products = [
	// Jeans
	{
		name: "Slim Fit Indigo Jeans",
		description: "Jean slim coupe moderne, tissu denim premium résistant au délavage.",
		price: 59.99,
		image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
		category: "jeans",
		isFeatured: true,
	},
	{
		name: "Relaxed Straight Jeans",
		description: "Coupe droite décontractée, confort maximal pour un usage quotidien.",
		price: 49.99,
		image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop",
		category: "jeans",
		isFeatured: false,
	},
	{
		name: "Vintage Washed Jeans",
		description: "Jean lavé vintage avec finitions effilochées tendance.",
		price: 69.99,
		image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop",
		category: "jeans",
		isFeatured: false,
	},

	// T-shirts
	{
		name: "Classic White Tee",
		description: "T-shirt blanc essentiel en coton bio 100%, coupe regular.",
		price: 24.99,
		image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
		category: "t-shirts",
		isFeatured: true,
	},
	{
		name: "Graphic Print Tee",
		description: "T-shirt imprimé graphique, impression haute qualité qui dure dans le temps.",
		price: 29.99,
		image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop",
		category: "t-shirts",
		isFeatured: false,
	},
	{
		name: "Polo Premium",
		description: "Polo en piqué de coton avec col brodé, look soigné et décontracté.",
		price: 39.99,
		image: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800&auto=format&fit=crop",
		category: "t-shirts",
		isFeatured: false,
	},

	// Shoes
	{
		name: "Urban Runner Sneakers",
		description: "Baskets running légères avec semelle amortissante, idéales en ville.",
		price: 89.99,
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
		category: "shoes",
		isFeatured: true,
	},
	{
		name: "Classic Leather Oxford",
		description: "Chaussures Oxford en cuir véritable, doublure intérieure confortable.",
		price: 129.99,
		image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop",
		category: "shoes",
		isFeatured: false,
	},
	{
		name: "Slip-On Canvas",
		description: "Espadrilles en toile légère, parfaites pour l'été.",
		price: 44.99,
		image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop",
		category: "shoes",
		isFeatured: false,
	},

	// Glasses
	{
		name: "Retro Round Sunglasses",
		description: "Lunettes rondes style rétro avec verres polarisés UV400.",
		price: 34.99,
		image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
		category: "glasses",
		isFeatured: true,
	},
	{
		name: "Aviator Classic",
		description: "Lunettes aviateur en métal doré, verres dégradés tendance.",
		price: 49.99,
		image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
		category: "glasses",
		isFeatured: false,
	},
	{
		name: "Blue Light Glasses",
		description: "Lunettes anti-lumière bleue pour un usage prolongé sur écran.",
		price: 39.99,
		image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop",
		category: "glasses",
		isFeatured: false,
	},

	// Jackets
	{
		name: "Bomber Jacket",
		description: "Bomber en nylon léger, doublure satinée, parfait entre-saison.",
		price: 99.99,
		image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
		category: "jackets",
		isFeatured: true,
	},
	{
		name: "Denim Jacket",
		description: "Veste en denim délavé, coupe droite classique indémodable.",
		price: 79.99,
		image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800&auto=format&fit=crop",
		category: "jackets",
		isFeatured: false,
	},
	{
		name: "Puffer Winter Jacket",
		description: "Doudoune légère rembourrage synthétique, protection jusqu'à -10°C.",
		price: 149.99,
		image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
		category: "jackets",
		isFeatured: false,
	},

	// Suits
	{
		name: "Slim Business Suit",
		description: "Costume slim deux pièces en laine mélangée, coupe italienne élégante.",
		price: 299.99,
		image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop",
		category: "suits",
		isFeatured: true,
	},
	{
		name: "Navy Blue Formal Suit",
		description: "Costume bleu marine classique, parfait pour les occasions formelles.",
		price: 349.99,
		image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop",
		category: "suits",
		isFeatured: false,
	},
	{
		name: "Casual Linen Suit",
		description: "Costume en lin léger pour un style détendu mais raffiné en été.",
		price: 249.99,
		image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&auto=format&fit=crop",
		category: "suits",
		isFeatured: false,
	},

	// Bags
	{
		name: "Leather Tote Bag",
		description: "Grand sac cabas en cuir véritable avec compartiments multiples.",
		price: 119.99,
		image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
		category: "bags",
		isFeatured: true,
	},
	{
		name: "Canvas Backpack",
		description: "Sac à dos en toile robuste avec port USB intégré, capacité 25L.",
		price: 69.99,
		image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
		category: "bags",
		isFeatured: false,
	},
	{
		name: "Crossbody Mini Bag",
		description: "Petit sac bandoulière tendance en cuir synthétique, idéal pour sortir.",
		price: 49.99,
		image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
		category: "bags",
		isFeatured: false,
	},
];

const seed = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ Connecté à MongoDB");

		await Product.deleteMany({});
		await User.deleteMany({});
		await redis.del("featured_products");
		console.log("🗑️  Collections et cache Redis vidés");

		const createdProducts = await Product.insertMany(products);
		console.log(`✅ ${createdProducts.length} produits insérés`);

		for (const u of users) {
			await User.create(u);
		}
		console.log(`✅ ${users.length} utilisateurs créés`);

		console.log("\n🎉 Base de données remplie avec succès !\n");
		console.log("Comptes créés :");
		console.log("  Admin     → admin@store.com      / admin123");
		console.log("  Client 1  → alice@example.com    / customer123");
		console.log("  Client 2  → bob@example.com      / customer123");
	} catch (err) {
		console.error("❌ Erreur seed :", err.message);
	} finally {
		await mongoose.disconnect();
		process.exit(0);
	}
};

seed();
