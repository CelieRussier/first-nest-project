import { Expose } from 'class-transformer';
import { Timestamp } from 'mongodb';
import { AddBookingToUserDto } from './dto/add-booking-to-user.dto';

//@Entity('bookings')
export class Booking {

    //@ObjectIdColumn()
    _id: string;

    //@Column({ length: 80, nullable: true })
    departureCoordinates?: string;

    //@Column({ length: 80, nullable: true })
    arrivalCoordinates?:string;

    //@Column({ type: 'datetime', nullable: true })
    departureTime?: Date;

    //@Column({ type: 'datetime', nullable: true })
    arrivalTime?: Date;

    //@Column({nullable: true })
    price?:string;

    //@ManyToOne(() => User, (user) => user.bookings)
    user?: string;/*AddBookingToUserDto*/

    created_at: Date;

    updated_at: Date;

    constructor(booking?: Partial<Booking>) {
        Object.assign(this, booking);
    }
    }