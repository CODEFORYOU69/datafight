import mongoose from 'mongoose';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
const MONGODB = process.env.DATABASE_URL || serverRuntimeConfig.connectionString;

async function connectDb() {
  if (mongoose.connection.readyState === 0) { // Si non connecté
    await mongoose.connect(MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à la base de données MongoDB');
  }
}

export default connectDb;
