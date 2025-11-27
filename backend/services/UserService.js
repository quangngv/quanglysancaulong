import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, all, run } from '../config/database.js';

class UserService {
  async register(userData) {
    const { FullName, Email, Password, Phone, Role } = userData;
    
    // Check if user already exists
    const existing = get('SELECT * FROM User WHERE Email = ?', [Email]);
    if (existing) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Insert user
    const result = run(
      'INSERT INTO User (FullName, Email, Password, Phone, Role) VALUES (?, ?, ?, ?, ?)',
      [FullName, Email, hashedPassword, Phone, Role || 'Customer']
    );

    return { UserID: result.lastInsertRowid, FullName, Email, Role: Role || 'Customer' };
  }

  async login(Email, Password) {
    const user = get('SELECT * FROM User WHERE Email = ?', [Email]);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(Password, user.Password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { UserID: user.UserID, Email: user.Email, Role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        UserID: user.UserID,
        FullName: user.FullName,
        Email: user.Email,
        Phone: user.Phone,
        Role: user.Role
      }
    };
  }

  async getUserById(UserID) {
    return get('SELECT UserID, FullName, Email, Phone, Role, CreatedAt FROM User WHERE UserID = ?', [UserID]);
  }

  async getAllUsers() {
    return all('SELECT UserID, FullName, Email, Phone, Role, CreatedAt FROM User ORDER BY CreatedAt DESC');
  }

  async updateUser(UserID, userData) {
    const { FullName, Email, Phone, Role } = userData;
    run(
      'UPDATE User SET FullName = ?, Email = ?, Phone = ?, Role = ? WHERE UserID = ?',
      [FullName, Email, Phone, Role, UserID]
    );
    return this.getUserById(UserID);
  }

  async deleteUser(UserID) {
    run('DELETE FROM User WHERE UserID = ?', [UserID]);
    return { success: true };
  }
}

export default new UserService();
