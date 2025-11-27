import { get, all, run } from '../config/database.js';

class BookingService {
  async createBooking(bookingData) {
    const { UserID, CourtID, BookingDate, StartTime, EndTime, PaymentMethod } = bookingData;

    // Check if court is available
    const existing = all(`
      SELECT * FROM Booking b
      JOIN CourtSlot cs ON b.CourtSlotID = cs.CourtSlotID
      WHERE cs.CourtID = ? 
      AND b.BookingDate = ?
      AND b.Status != 'Cancelled'
      AND (
        (b.StartTime <= ? AND b.EndTime > ?) OR
        (b.StartTime < ? AND b.EndTime >= ?) OR
        (b.StartTime >= ? AND b.EndTime <= ?)
      )
    `, [CourtID, BookingDate, StartTime, StartTime, EndTime, EndTime, StartTime, EndTime]);

    if (existing.length > 0) {
      throw new Error('Court is not available for selected time');
    }

    // Get court price
    const court = get('SELECT PricePerHour FROM Court WHERE CourtID = ?', [CourtID]);
    
    // Calculate duration in hours
    const start = new Date(`2000-01-01 ${StartTime}`);
    const end = new Date(`2000-01-01 ${EndTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    const totalPrice = court.PricePerHour * hours;

    // Create or get CourtSlot
    let courtSlot = get('SELECT CourtSlotID FROM CourtSlot WHERE CourtID = ? LIMIT 1', [CourtID]);

    if (!courtSlot) {
      const slotResult = run(
        'INSERT INTO CourtSlot (CourtID, SlotID, Price, IsAvailable) VALUES (?, 1, ?, 1)',
        [CourtID, court.PricePerHour]
      );
      courtSlot = { CourtSlotID: slotResult.lastInsertRowid };
    }

    // Create booking
    const result = run(
      'INSERT INTO Booking (UserID, CourtSlotID, BookingDate, StartTime, EndTime, TotalPrice, Status, PaymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [UserID, courtSlot.CourtSlotID, BookingDate, StartTime, EndTime, totalPrice, 'Pending', PaymentMethod]
    );

    return this.getBookingById(result.lastInsertRowid);
  }

  async getBookingById(BookingID) {
    return get(`
      SELECT b.*, u.FullName, u.Email, c.CourtName, c.Address, ct.TypeName
      FROM Booking b
      JOIN User u ON b.UserID = u.UserID
      JOIN CourtSlot cs ON b.CourtSlotID = cs.CourtSlotID
      JOIN Court c ON cs.CourtID = c.CourtID
      LEFT JOIN CourtType ct ON c.TypeID = ct.TypeID
      WHERE b.BookingID = ?
    `, [BookingID]);
  }

  async getUserBookings(UserID) {
    return all(`
      SELECT b.*, c.CourtName, c.Address, ct.TypeName
      FROM Booking b
      JOIN CourtSlot cs ON b.CourtSlotID = cs.CourtSlotID
      JOIN Court c ON cs.CourtID = c.CourtID
      LEFT JOIN CourtType ct ON c.TypeID = ct.TypeID
      WHERE b.UserID = ?
      ORDER BY b.BookingDate DESC, b.StartTime DESC
    `, [UserID]);
  }

  async getAllBookings() {
    return all(`
      SELECT b.*, u.FullName, u.Email, c.CourtName, c.Address, ct.TypeName
      FROM Booking b
      JOIN User u ON b.UserID = u.UserID
      JOIN CourtSlot cs ON b.CourtSlotID = cs.CourtSlotID
      JOIN Court c ON cs.CourtID = c.CourtID
      LEFT JOIN CourtType ct ON c.TypeID = ct.TypeID
      ORDER BY b.BookingDate DESC, b.StartTime DESC
    `);
  }

  async updateBookingStatus(BookingID, Status) {
    run('UPDATE Booking SET Status = ? WHERE BookingID = ?', [Status, BookingID]);
    return this.getBookingById(BookingID);
  }

  async cancelBooking(BookingID) {
    run('UPDATE Booking SET Status = ? WHERE BookingID = ?', ['Cancelled', BookingID]);
    return { success: true };
  }

  async getBookingStats() {
    return get(`
      SELECT 
        COUNT(*) as totalBookings,
        SUM(CASE WHEN Status = 'Paid' THEN TotalPrice ELSE 0 END) as totalRevenue,
        COUNT(CASE WHEN Status = 'Pending' THEN 1 END) as pendingBookings,
        COUNT(CASE WHEN Status = 'Confirmed' THEN 1 END) as confirmedBookings,
        COUNT(CASE WHEN Status = 'Paid' THEN 1 END) as paidBookings
      FROM Booking
    `);
  }
}

export default new BookingService();
