import { Booking } from "src/bookings/booking.entity";

export type UpdateBookingDto = Partial<Omit<Booking, 'id'>>