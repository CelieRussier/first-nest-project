import { Booking } from '../booking.entity';
import { AddBookingToUserDto } from './add-booking-to-user.dto';

type BookingI =Omit<Booking, '_id' | 'created_at' | 'updated_at'>;

export class CreateBookingDto {

    //@Column({ length: 80, nullable: true })
    departureCoordinates: string;

    //@Column({ length: 80, nullable: true })
    arrivalCoordinates:string;

    //@Column({ type: 'datetime', nullable: true })
    departureTime: Date;

    //@Column({ type: 'datetime', nullable: true })
    arrivalTime: Date;

    //@Column({nullable: true })
    price:string;

    //@ManyToOne(() => User, (user) => user.bookings)
    user: AddBookingToUserDto
}