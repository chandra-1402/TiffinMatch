import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import {
  INITIAL_USER,
  REGISTERED_ACCOUNTS,
  DELIVERY_ADDRESSES,
  HOME_COOKS,
  INITIAL_ORDERS,
  ADMIN_AUDITS,
  CATEGORIES
} from '../src/data/mockData.js';

const { Pool } = pg;

async function setupDatabase() {
  console.log('Connecting to PostgreSQL database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Creating tables...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        unique_id TEXT UNIQUE,
        name TEXT,
        role TEXT,
        designation TEXT,
        phone TEXT,
        passcode TEXT,
        password TEXT,
        badge_number TEXT,
        profile_pic TEXT
      )
    `);

    // Create cook_profiles table
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        label TEXT,
        icon TEXT
      )
    `);

    // Create delivery_addresses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS delivery_addresses (
        id TEXT PRIMARY KEY,
        label TEXT,
        detail TEXT,
        distance_km REAL,
        tier TEXT
      )
    `);

    console.log('Tables created successfully. Seeding data...');

    // Insert customer (INITIAL_USER)
    await pool.query(
      'INSERT INTO users (id, unique_id, name, role, designation, phone, passcode, password, badge_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING',
      [
        INITIAL_USER.id,
        INITIAL_USER.uniqueId,
        INITIAL_USER.name,
        INITIAL_USER.role,
        INITIAL_USER.designation,
        null, null, 'password123', null
      ]
    );

    // Insert registered accounts
    for (const key of Object.keys(REGISTERED_ACCOUNTS)) {
      const account = REGISTERED_ACCOUNTS[key];
      const defaultPassword = account.pin || account.passcode || 'password123';
      await pool.query(
        'INSERT INTO users (id, unique_id, name, role, designation, phone, passcode, password, badge_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING',
        [
          account.uniqueId,
          account.uniqueId,
          account.name,
          account.role,
          account.designation,
          account.phone || null,
          account.passcode || null,
          defaultPassword,
          account.badgeNumber || null
        ]
      );
    }

    // Insert Cooks and Menu Items
    for (const cook of HOME_COOKS) {
      await pool.query(`
        INSERT INTO cook_profiles (
          id, user_id, kitchen_name, rating, reviews_count, distance_km, locality, cuisine, tagline, 
          image, cook_avatar, price_range, delivery_radius_km, prep_time_mins, is_hygiene_verified, 
          fssai_verified, experience_years, diet_type, daily_capacity, booked_capacity, hygiene_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (id) DO NOTHING
      `, [
        cook.id,
        cook.uniqueId,
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
        cook.isHygieneVerified ? true : false,
        cook.fssaiVerified ? true : false,
        cook.experienceYears,
        cook.dietType,
        cook.dailyCapacity,
        cook.bookedCapacity,
        cook.hygieneScore
      ]);

      if (cook.menu) {
        for (const item of cook.menu) {
          await pool.query(`
            INSERT INTO menu_items (
              id, cook_id, name, price, description, category, is_popular, is_thali, diet
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO NOTHING
          `, [
            item.id,
            cook.id,
            item.name,
            item.price,
            item.desc,
            item.category,
            item.isPopular ? true : false,
            item.isThali ? true : false,
            item.diet
          ]);
        }
      }
    }

    // Insert Orders
    for (const order of INITIAL_ORDERS) {
      await pool.query(`
        INSERT INTO orders (
          id, customer_id, customer_name, cook_name, items, food_category, price, delivery_fee, status, ordered_at, delivery_address, estimated_delivery
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING
      `, [
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
      ]);
    }

    // Insert Admin Audits
    for (const audit of ADMIN_AUDITS) {
      await pool.query(`
        INSERT INTO admin_audits (
          id, cook_id, cook_name, verification_type, status, date, auditor, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `, [
        audit.id,
        audit.cookId,
        audit.cookName,
        audit.verificationType,
        audit.status,
        audit.date,
        audit.auditor,
        audit.notes
      ]);
    }

    // Insert Categories
    for (const category of CATEGORIES) {
      await pool.query(`
        INSERT INTO categories (id, label, icon) VALUES ($1, $2, $3)
        ON CONFLICT (id) DO NOTHING
      `, [category.id, category.label, category.icon]);
    }

    // Insert Delivery Addresses
    for (const address of DELIVERY_ADDRESSES) {
      await pool.query(`
        INSERT INTO delivery_addresses (id, label, detail, distance_km, tier) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
      `, [address.id, address.label, address.detail, address.distanceKm, address.tier]);
    }

    console.log('Data seeded successfully!');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await pool.end();
  }
}

setupDatabase();
