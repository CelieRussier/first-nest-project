//import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ObjectIdColumn, ObjectID, Index } from 'typeorm';
import { Exclude, Expose, Type } from "class-transformer";
import { IsString } from "class-validator";
import { Booking } from "../bookings/booking.entity";

//@Entity('users')
export class User {

    constructor(partial: Partial<User> = {}) {
        Object.assign(this, partial);
      }

    //@ObjectIdColumn() id: ObjectID;
    _id: string;


    //@Column({ length: 80 })
    firstname:string;

    //@Index()
    //@Column({ length: 80 })
    @IsString()
    @Exclude()
    private _lastname:string;

    @Expose()
    get lastname() {
      return this._lastname
    }

    set lastname (v: string) {
      this._lastname = v ? v.toUpperCase() : undefined
    }
   
    @Expose({groups: ['api']})
    get fullName () {
      return this.firstname + ' ' + this.lastname
    }
    
    birthday!: Date;

    //@OneToMany(() => Booking, (booking) => booking.user)
    @Type(() => Booking)
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