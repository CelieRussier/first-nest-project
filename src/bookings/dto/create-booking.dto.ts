import { Booking } from '../booking.entity';

export type CreateBookingDto = Partial<Omit<Booking,'id' >>