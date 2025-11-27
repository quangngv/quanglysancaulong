import { get, all, run } from '../config/database.js';

class CourtService {
  async getAllCourts() {
    return all(`
      SELECT c.*, ct.TypeName, u.FullName as ManagerName 
      FROM Court c 
      LEFT JOIN CourtType ct ON c.TypeID = ct.TypeID
      LEFT JOIN User u ON c.ManagerID = u.UserID
      ORDER BY c.CreatedAt DESC
    `);
  }

  async getCourtById(CourtID) {
    return get(`
      SELECT c.*, ct.TypeName, u.FullName as ManagerName 
      FROM Court c 
      LEFT JOIN CourtType ct ON c.TypeID = ct.TypeID
      LEFT JOIN User u ON c.ManagerID = u.UserID
      WHERE c.CourtID = ?
    `, [CourtID]);
  }

  async getAvailableCourts(date, startTime, endTime) {
    return all(`
      SELECT DISTINCT c.*, ct.TypeName 
      FROM Court c
      LEFT JOIN CourtType ct ON c.TypeID = ct.TypeID
      WHERE c.Status = 'Available'
      AND c.CourtID NOT IN (
        SELECT cs.CourtID 
        FROM Booking b
        JOIN CourtSlot cs ON b.CourtSlotID = cs.CourtSlotID
        WHERE b.BookingDate = ? 
        AND b.Status != 'Cancelled'
        AND (
          (b.StartTime <= ? AND b.EndTime > ?) OR
          (b.StartTime < ? AND b.EndTime >= ?) OR
          (b.StartTime >= ? AND b.EndTime <= ?)
        )
      )
    `, [date, startTime, startTime, endTime, endTime, startTime, endTime]);
  }

  async createCourt(courtData) {
    const { ManagerID, TypeID, CourtName, Address, PricePerHour, Status } = courtData;
    const result = run(
      'INSERT INTO Court (ManagerID, TypeID, CourtName, Address, PricePerHour, Status) VALUES (?, ?, ?, ?, ?, ?)',
      [ManagerID, TypeID, CourtName, Address, PricePerHour, Status || 'Available']
    );
    return this.getCourtById(result.lastInsertRowid);
  }

  async updateCourt(CourtID, courtData) {
    const { ManagerID, TypeID, CourtName, Address, PricePerHour, Status } = courtData;
    run(
      'UPDATE Court SET ManagerID = ?, TypeID = ?, CourtName = ?, Address = ?, PricePerHour = ?, Status = ? WHERE CourtID = ?',
      [ManagerID, TypeID, CourtName, Address, PricePerHour, Status, CourtID]
    );
    return this.getCourtById(CourtID);
  }

  async deleteCourt(CourtID) {
    run('DELETE FROM Court WHERE CourtID = ?', [CourtID]);
    return { success: true };
  }

  async getCourtTypes() {
    return all('SELECT * FROM CourtType');
  }

  async getTimeSlots() {
    return all('SELECT * FROM TimeSlot ORDER BY StartTime');
  }
}

export default new CourtService();
