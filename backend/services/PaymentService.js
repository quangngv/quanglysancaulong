import { get, all, run } from '../config/database.js';

class PaymentService {
  async createPayment(paymentData) {
    const { BookingID, Amount, PaymentMethod } = paymentData;
    
    // Generate transaction code
    const transactionCode = 'TXN' + Date.now() + Math.random().toString(36).substring(7).toUpperCase();

    const result = run(
      'INSERT INTO Payment (BookingID, Amount, TransactionCode, PaymentStatus) VALUES (?, ?, ?, ?)',
      [BookingID, Amount, transactionCode, 'Completed']
    );

    // Update booking status to Paid
    run('UPDATE Booking SET Status = ? WHERE BookingID = ?', ['Paid', BookingID]);

    return this.getPaymentById(result.lastInsertRowid);
  }

  async getPaymentById(PaymentID) {
    return get(`
      SELECT p.*, b.BookingDate, b.StartTime, b.EndTime, u.FullName, c.CourtName
      FROM Payment p
      JOIN Booking b ON p.BookingID = b.BookingID
      JOIN User u ON b.UserID = u.UserID
      JOIN CourtSlot cs ON b.CourtSlotID = cs.CourtSlotID
      JOIN Court c ON cs.CourtID = c.CourtID
      WHERE p.PaymentID = ?
    `, [PaymentID]);
  }

  async getPaymentByBookingId(BookingID) {
    return get('SELECT * FROM Payment WHERE BookingID = ?', [BookingID]);
  }

  async getAllPayments() {
    return all(`
      SELECT p.*, b.BookingDate, u.FullName, c.CourtName
      FROM Payment p
      JOIN Booking b ON p.BookingID = b.BookingID
      JOIN User u ON b.UserID = u.UserID
      JOIN CourtSlot cs ON b.CourtSlotID = cs.CourtSlotID
      JOIN Court c ON cs.CourtID = c.CourtID
      ORDER BY p.PaymentDate DESC
    `);
  }

  async confirmPayment(BookingID) {
    // Check if payment already exists
    const existing = await this.getPaymentByBookingId(BookingID);
    if (existing) {
      throw new Error('Payment already exists for this booking');
    }

    // Get booking details
    const booking = get('SELECT TotalPrice FROM Booking WHERE BookingID = ?', [BookingID]);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    return this.createPayment({
      BookingID,
      Amount: booking.TotalPrice,
      PaymentMethod: 'Cash'
    });
  }
}

export default new PaymentService();
