//import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ObjectIdColumn, ObjectID, Index } from 'typeorm';
import { GeoJsonObject, GeoJsonTypes, Point } from "geojson";
import { Booking } from "../bookings/booking.entity";

//@Entity('users')
export class User {

    //@ObjectIdColumn() id: ObjectID;
    _id: string;

    //@Column({ length: 80 })
    firstname:string;

    //@Index()
    //@Column({ length: 80 })
    lastname:string;

    birthday: Date;

    //@OneToMany(() => Booking, (booking) => booking.user)
    bookings?: Booking[]

    created_at: Date;

    updated_at: Date;

    lat: number;
    lng: number;

    position : Object;

    /*constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }*/
}