import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  INITIAL_USER,
  REGISTERED_ACCOUNTS,
  DELIVERY_ADDRESSES,
  HOME_COOKS,
  INITIAL_ORDERS,
  ADMIN_AUDITS,
  CATEGORIES
} from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

async function setupDatabase() {
  console.log('Connecting to database...');
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  console.log('Creating tables...');
  
  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      unique_id TEXT UNIQUE,
      name TEXT,
      role TEXT,
      designation TEXT,
      phone TEXT,
      passcode TEXT,
      password TEXT,
      badge_number TEXT
    )
  `);

  // Create cook_profiles table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cook_profiles (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      kitchen_name TEXT,
      rating REAL,
      reviews_count INTEGER,
      distance_km REAL,
      locality TEXT,
      cuisine TEXT,
      tagline TEXT,
      image TEXT,
      cook_avatar TEXT,
      price_range TEXT,
      delivery_radius_km REAL,
      prep_time_mins TEXT,
      is_hygiene_verified BOOLEAN,
      fssai_verified BOOLEAN,
      experience_years INTEGER,
      diet_type TEXT,
      daily_capacity INTEGER,
      booked_capacity INTEGER,
      hygiene_score INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create menu_items table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      cook_id INTEGER,
      name TEXT,
      price REAL,
      description TEXT,
      category TEXT,
      is_popular BOOLEAN,
      is_thali BOOLEAN,
      diet TEXT,
      FOREIGN KEY (cook_id) REFERENCES cook_profiles(id)
    )
  `);

  // Create orders table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      customer_name TEXT,
      cook_name TEXT,
      items TEXT,
      food_category TEXT,
      price REAL,
      delivery_fee REAL,
      status TEXT,
      ordered_at TEXT,
      delivery_address TEXT,
      estimated_delivery TEXT
    )
  `);

  // Create admin_audits table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin_audits (
      id TEXT PRIMARY KEY,
      cook_id TEXT,
      cook_name TEXT,
      verification_type TEXT,
      status TEXT,
      date TEXT,
      auditor TEXT,
      notes TEXT
    )
  `);

  // Create categories table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT,
      icon TEXT
    )
  `);

  // Create delivery_addresses table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS delivery_addresses (
      id TEXT PRIMARY KEY,
      label TEXT,
      detail TEXT,
      distance_km REAL,
      tier TEXT
    )
  `);

  console.log('Tables created successfully. Seeding data...');

  // Helper for inserting users
  const insertUser = await db.prepare(
    'INSERT OR REPLACE INTO users (id, unique_id, name, role, designation, phone, passcode, password, badge_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  // Insert customer (INITIAL_USER)
  await insertUser.run(
    INITIAL_USER.id,
    INITIAL_USER.uniqueId,
    INITIAL_USER.name,
    INITIAL_USER.role,
    INITIAL_USER.designation,
    null, null, 'password123', null
  );

  // Insert registered accounts
  for (const key of Object.keys(REGISTERED_ACCOUNTS)) {
    const account = REGISTERED_ACCOUNTS[key];
    const defaultPassword = account.pin || account.passcode || 'password123';
    await insertUser.run(
      account.uniqueId, // Using uniqueId as ID for these
      account.uniqueId,
      account.name,
      account.role,
      account.designation,
      account.phone || null,
      account.passcode || null,
      defaultPassword,
      account.badgeNumber || null
    );
  }

  // Insert Cooks and Menu Items
  const insertCook = await db.prepare(`
    INSERT OR REPLACE INTO cook_profiles (
      id, user_id, kitchen_name, rating, reviews_count, distance_km, locality, cuisine, tagline, 
      image, cook_avatar, price_range, delivery_radius_km, prep_time_mins, is_hygiene_verified, 
      fssai_verified, experience_years, diet_type, daily_capacity, booked_capacity, hygiene_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMenuItem = await db.prepare(`
    INSERT OR REPLACE INTO menu_items (
      id, cook_id, name, price, description, category, is_popular, is_thali, diet
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const cook of HOME_COOKS) {
    await insertCook.run(
      cook.id,
      cook.uniqueId, // Assuming cook's uniqueId relates to user
      cook.name,
      cook.rating,
      cook.reviewsCount,
      cook.distanceKm,
      cook.locality,
      cook.cuisine,
      cook.tagline,
      cook.image,
      cook.cookAvatar,
      cook.priceRange,
      cook.deliveryRadiusKm,
      cook.prepTimeMins,
      cook.isHygieneVerified ? 1 : 0,
      cook.fssaiVerified ? 1 : 0,
      cook.experienceYears,
      cook.dietType,
      cook.dailyCapacity,
      cook.bookedCapacity,
      cook.hygieneScore
    );

    if (cook.menu) {
      for (const item of cook.menu) {
        await insertMenuItem.run(
          item.id,
          cook.id,
          item.name,
          item.price,
          item.desc,
          item.category,
          item.isPopular ? 1 : 0,
          item.isThali ? 1 : 0,
          item.diet
        );
      }
    }
  }

  // Insert Orders
  const insertOrder = await db.prepare(`
    INSERT OR REPLACE INTO orders (
      id, customer_id, customer_name, cook_name, items, food_category, price, delivery_fee, status, ordered_at, delivery_address, estimated_delivery
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const order of INITIAL_ORDERS) {
    await insertOrder.run(
      order.id,
      order.customerId,
      order.customer,
      order.cook,
      order.items,
      'Mixed',
      order.price,
      order.deliveryFee,
      order.status,
      order.orderedAt,
      order.deliveryAddress,
      order.estimatedDelivery
    );
  }

  // Insert Admin Audits
  const insertAudit = await db.prepare(`
    INSERT OR REPLACE INTO admin_audits (
      id, cook_id, cook_name, verification_type, status, date, auditor, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const audit of ADMIN_AUDITS) {
    await insertAudit.run(
      audit.id,
      audit.cookId,
      audit.cookName,
      audit.verificationType,
      audit.status,
      audit.date,
      audit.auditor,
      audit.notes
    );
  }

  // Insert Categories
  const insertCategory = await db.prepare(`
    INSERT OR REPLACE INTO categories (id, label, icon) VALUES (?, ?, ?)
  `);
  for (const category of CATEGORIES) {
    await insertCategory.run(category.id, category.label, category.icon);
  }

  // Insert Delivery Addresses
  const insertAddress = await db.prepare(`
    INSERT OR REPLACE INTO delivery_addresses (id, label, detail, distance_km, tier) VALUES (?, ?, ?, ?, ?)
  `);
  for (const address of DELIVERY_ADDRESSES) {
    await insertAddress.run(address.id, address.label, address.detail, address.distanceKm, address.tier);
  }

  await insertUser.finalize();
  await insertCook.finalize();
  await insertMenuItem.finalize();
  await insertOrder.finalize();
  await insertAudit.finalize();
  await insertCategory.finalize();
  await insertAddress.finalize();

  console.log('Data seeded successfully!');
  await db.close();
}

setupDatabase().catch(err => {
  console.error('Error setting up database:', err);
});
