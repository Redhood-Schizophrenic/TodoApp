import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/todo?authSource=admin';

async function dropAllCollections() {
	try {
		// Connect to MongoDB
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to MongoDB');

		// Get all collections
		const collections = await mongoose.connection.db.collections();

		// Drop each collection
		for (const collection of collections) {
			try {
				await collection.drop();
				console.log(`✅ Dropped collection: ${collection.collectionName}`);
			} catch (error) {
				console.error(`❌ Error dropping collection ${collection.collectionName}:`, error);
			}
		}

		console.log('All collections dropped successfully');
	} catch (error) {
		console.error('Error:', error);
	} finally {
		// Close the connection
		await mongoose.connection.close();
		console.log('Disconnected from MongoDB');
	}
}

dropAllCollections();
