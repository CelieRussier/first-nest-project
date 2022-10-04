import { Booking } from "src/bookings/booking.entity";
import { User } from "../user.entity";

type UserI =Partial<Omit<User, 'booking' | 'fullName'>>;

export class UpdateUserDto implements UserI {

    //@ApiProperty()
    lastname: string;

    //@ApiProperty()
    birthday: Date;

    bookings?: Booking[];

    lat: number;
    lng: number;
  
    firstname:string;
}
