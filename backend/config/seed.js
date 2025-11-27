import bcrypt from 'bcryptjs';
import { get, run } from './database.js';

export async function seedInitialData() {
  try {
    // Check if admin already exists
    const admin = get("SELECT * FROM User WHERE Role = 'Admin'");
    
    if (!admin) {
      // Create default admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      run(
        'INSERT INTO User (FullName, Email, Password, Phone, Role) VALUES (?, ?, ?, ?, ?)',
        ['Administrator', 'admin@example.com', hashedPassword, '0123456789', 'Admin']
      );
      console.log('✓ Created default admin account: admin@example.com / admin123');
    }

    // Check if courts exist
    const courtCount = get('SELECT COUNT(*) as count FROM Court');
    
    if (courtCount.count === 0) {
      // Add sample courts
      const sampleCourts = [
        ['Sân Cầu Lông A1', 1, 'Số 123, Đường ABC, Quận 1, TP.HCM', 100000, 'Available'],
        ['Sân Cầu Lông A2', 1, 'Số 456, Đường DEF, Quận 2, TP.HCM', 120000, 'Available'],
        ['Sân Cầu Lông B1', 1, 'Số 789, Đường GHI, Quận 3, TP.HCM', 150000, 'Available'],
        ['Sân Bóng Đá Mini C1', 2, 'Số 321, Đường JKL, Quận 4, TP.HCM', 200000, 'Available']
      ];

      for (const court of sampleCourts) {
        run(
          'INSERT INTO Court (CourtName, TypeID, Address, PricePerHour, Status) VALUES (?, ?, ?, ?, ?)',
          court
        );
      }
      console.log('✓ Added sample courts');
    }

    console.log('✓ Database seeding completed');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
