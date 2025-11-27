import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database connection (SQLite - no MySQL needed!)
const db = new Database(join(__dirname, '../database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
export async function initDatabase() {
  try {
    console.log('Creating database tables...');

    // Create User table
    db.exec(`
      CREATE TABLE IF NOT EXISTS User (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        FullName TEXT NOT NULL,
        Email TEXT UNIQUE NOT NULL,
        Password TEXT NOT NULL,
        Phone TEXT,
        Role TEXT DEFAULT 'Customer' CHECK(Role IN ('Admin', 'Customer', 'Manager')),
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create CourtType table
    db.exec(`
      CREATE TABLE IF NOT EXISTS CourtType (
        TypeID INTEGER PRIMARY KEY AUTOINCREMENT,
        TypeName TEXT NOT NULL,
        Description TEXT
      )
    `);

    // Create Court table
    db.exec(`
      CREATE TABLE IF NOT EXISTS Court (
        CourtID INTEGER PRIMARY KEY AUTOINCREMENT,
        ManagerID INTEGER,
        TypeID INTEGER,
        CourtName TEXT NOT NULL,
        Address TEXT,
        PricePerHour REAL,
        Status TEXT DEFAULT 'Available' CHECK(Status IN ('Available', 'Unavailable', 'Maintenance')),
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ManagerID) REFERENCES User(UserID),
        FOREIGN KEY (TypeID) REFERENCES CourtType(TypeID)
      )
    `);

    // Create TimeSlot table
    db.exec(`
      CREATE TABLE IF NOT EXISTS TimeSlot (
        SlotID INTEGER PRIMARY KEY AUTOINCREMENT,
        StartTime TEXT NOT NULL,
        EndTime TEXT NOT NULL
      )
    `);

    // Create CourtSlot table
    db.exec(`
      CREATE TABLE IF NOT EXISTS CourtSlot (
        CourtSlotID INTEGER PRIMARY KEY AUTOINCREMENT,
        CourtID INTEGER,
        SlotID INTEGER,
        Price REAL,
        DayOfWeek TEXT CHECK(DayOfWeek IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
        IsAvailable INTEGER DEFAULT 1,
        FOREIGN KEY (CourtID) REFERENCES Court(CourtID),
        FOREIGN KEY (SlotID) REFERENCES TimeSlot(SlotID)
      )
    `);

    // Create Booking table
    db.exec(`
      CREATE TABLE IF NOT EXISTS Booking (
        BookingID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER,
        CourtSlotID INTEGER,
        BookingDate DATE NOT NULL,
        StartTime TEXT NOT NULL,
        EndTime TEXT NOT NULL,
        TotalPrice REAL,
        Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Confirmed', 'Paid', 'Cancelled')),
        PaymentMethod TEXT,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES User(UserID),
        FOREIGN KEY (CourtSlotID) REFERENCES CourtSlot(CourtSlotID)
      )
    `);

    // Create Payment table
    db.exec(`
      CREATE TABLE IF NOT EXISTS Payment (
        PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,
        BookingID INTEGER,
        Amount REAL,
        PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        TransactionCode TEXT,
        PaymentStatus TEXT DEFAULT 'Pending' CHECK(PaymentStatus IN ('Pending', 'Completed', 'Failed')),
        FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
      )
    `);

    // Insert default data
    const courtTypeCount = db.prepare('SELECT COUNT(*) as count FROM CourtType').get();
    if (courtTypeCount.count === 0) {
      const insertCourtType = db.prepare('INSERT INTO CourtType (TypeID, TypeName, Description) VALUES (?, ?, ?)');
      insertCourtType.run(1, 'Cầu lông', 'Sân cầu lông tiêu chuẩn');
      insertCourtType.run(2, 'Bóng đá', 'Sân bóng đá mini');
      console.log('✓ Inserted default court types');
    }

    // Insert default time slots
    const timeSlotCount = db.prepare('SELECT COUNT(*) as count FROM TimeSlot').get();
    if (timeSlotCount.count === 0) {
      const insertSlot = db.prepare('INSERT INTO TimeSlot (SlotID, StartTime, EndTime) VALUES (?, ?, ?)');
      const timeSlots = [
        [1, '06:00:00', '07:00:00'], [2, '07:00:00', '08:00:00'], [3, '08:00:00', '09:00:00'],
        [4, '09:00:00', '10:00:00'], [5, '10:00:00', '11:00:00'], [6, '11:00:00', '12:00:00'],
        [7, '12:00:00', '13:00:00'], [8, '13:00:00', '14:00:00'], [9, '14:00:00', '15:00:00'],
        [10, '15:00:00', '16:00:00'], [11, '16:00:00', '17:00:00'], [12, '17:00:00', '18:00:00'],
        [13, '18:00:00', '19:00:00'], [14, '19:00:00', '20:00:00'], [15, '20:00:00', '21:00:00'],
        [16, '21:00:00', '22:00:00']
      ];
      
      for (const slot of timeSlots) {
        insertSlot.run(...slot);
      }
      console.log('✓ Inserted default time slots');
    }

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Helper function to get single row
export function get(sql, params = []) {
  try {
    return db.prepare(sql).get(params);
  } catch (error) {
    console.error('Get error:', error);
    throw error;
  }
}

// Helper function to run queries that return rows
export function all(sql, params = []) {
  try {
    return db.prepare(sql).all(params);
  } catch (error) {
    console.error('All error:', error);
    throw error;
  }
}

// Helper function to run insert/update/delete
export function run(sql, params = []) {
  try {
    return db.prepare(sql).run(params);
  } catch (error) {
    console.error('Run error:', error);
    throw error;
  }
}

export default db;
