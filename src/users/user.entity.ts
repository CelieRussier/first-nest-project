//import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ObjectIdColumn, ObjectID, Index } from 'typeorm';
import { Booking } from "../bookings/booking.entity";

//@Entity('users')
export class User {

    //@ObjectIdColumn() id: ObjectID;
    id: string;

    //@Column({ length: 80 })
    firstname:string;

    //@Index()
    //@Column({ length: 80 })
    lastname:string;

    //@OneToMany(() => Booking, (booking) => booking.user)
    bookings?: Booking[]

    /*constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }*/
}