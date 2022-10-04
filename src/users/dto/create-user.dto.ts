import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { Booking } from "src/bookings/booking.entity";
import { User } from "../user.entity";

//export class CreateUserDto = Omit<User, 'booking' | 'getfullname'>


type UserI =Partial<Omit<User, 'booking' | 'fullName'>>;

export class CreateUserDto implements UserI {

    @IsString()
    lastname: string;

    //@ApiProperty()
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    birthday?: Date;

    @IsNumber()
    lat: number;
    @IsNumber()
    lng: number;
  
    @IsString()
    firstname:string;
}


// = Omit<User, 'booking' /*& 'getfullname'*/>
