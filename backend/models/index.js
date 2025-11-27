export class User {
  constructor(data) {
    this.UserID = data.UserID;
    this.FullName = data.FullName;
    this.Email = data.Email;
    this.Password = data.Password;
    this.Phone = data.Phone;
    this.Role = data.Role || 'Customer';
    this.CreatedAt = data.CreatedAt;
  }
}

export class CourtType {
  constructor(data) {
    this.TypeID = data.TypeID;
    this.TypeName = data.TypeName;
    this.Description = data.Description;
  }
}

export class Court {
  constructor(data) {
    this.CourtID = data.CourtID;
    this.ManagerID = data.ManagerID;
    this.TypeID = data.TypeID;
    this.CourtName = data.CourtName;
    this.Address = data.Address;
    this.PricePerHour = data.PricePerHour;
    this.Status = data.Status || 'Available';
    this.CreatedAt = data.CreatedAt;
  }
}

export class TimeSlot {
  constructor(data) {
    this.SlotID = data.SlotID;
    this.StartTime = data.StartTime;
    this.EndTime = data.EndTime;
  }
}

export class CourtSlot {
  constructor(data) {
    this.CourtSlotID = data.CourtSlotID;
    this.CourtID = data.CourtID;
    this.SlotID = data.SlotID;
    this.Price = data.Price;
    this.DayOfWeek = data.DayOfWeek;
    this.IsAvailable = data.IsAvailable;
  }
}

export class Booking {
  constructor(data) {
    this.BookingID = data.BookingID;
    this.UserID = data.UserID;
    this.CourtSlotID = data.CourtSlotID;
    this.BookingDate = data.BookingDate;
    this.StartTime = data.StartTime;
    this.EndTime = data.EndTime;
    this.TotalPrice = data.TotalPrice;
    this.Status = data.Status || 'Pending';
    this.PaymentMethod = data.PaymentMethod;
    this.CreatedAt = data.CreatedAt;
  }
}

export class Payment {
  constructor(data) {
    this.PaymentID = data.PaymentID;
    this.BookingID = data.BookingID;
    this.Amount = data.Amount;
    this.PaymentDate = data.PaymentDate;
    this.TransactionCode = data.TransactionCode;
    this.PaymentStatus = data.PaymentStatus || 'Pending';
  }
}
