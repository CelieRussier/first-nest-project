import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ObjectIdColumn, ObjectID } from 'typeorm';
import { User } from "../users/user.entity";
import { AddBookingToUserDto } from './dto/add-booking-to-user.dto';

@Entity('bookings')
export class Booking {

    @ObjectIdColumn() id: ObjectID;

    @Column({ length: 80, nullable: true })
    departureCoordinates: string;

    @Column({ length: 80, nullable: true })
    arrivalCoordinates:string;

    @Column({ type: 'datetime', nullable: true })
    departureTime:string;

    @Column({ type: 'datetime', nullable: true })
    arrivalTime:string;

    @Column({nullable: true })
    price:string;

    @ManyToOne(() => User, (user) => user.bookings)
    user: AddBookingToUserDto

    constructor(booking?: Partial<Booking>) {
        Object.assign(this, booking);
    }
    }