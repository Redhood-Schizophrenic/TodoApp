import dbConnect from "./app/lib/db";
import { UsersSchema } from "./app/lib/models/Users";
import { TodosSchema } from "./app/lib/models/Todos";
import mongoose from "mongoose";

export async function register() {
	try {
		const mongo_connection = await dbConnect();
		if (mongo_connection.returncode === 200) {
			await initializeModels();
			console.log("✅ Database connected and models initialized successfully");
		} else {
			console.log("✅ Going Offline");
		}
	} catch (error) {
		console.error("❌ Error initializing database:", error);
	}
}

async function initializeModels() {
	const modelDefinitions = [
		{ name: 'Users', schema: UsersSchema },
		{ name: 'Todos', schema: TodosSchema },
	];

	for (const { name, schema } of modelDefinitions) {
		try {
			// Check if model exists, if not create it
			mongoose.models[name] || mongoose.model(name, schema);

			// For Eatofy Staff, ensure at least one admin exists
			if (name === 'Users') {
				const Users = mongoose.model(name);
				const exists = await Users.exists({});

				if (!exists) {
					await Users.create({
						Email: 'user@gmail.com',
						Password: 'user123', // Will be hashed by pre-save hook
					});
					console.log(`✅ Created default root admin: user@gmail.com`);
				}
			}

			console.log(`✅ Model initialized: ${name}`);
		} catch (error) {
			console.error(`❌ Error initializing model ${name}:`, error);
		}
	}
}
