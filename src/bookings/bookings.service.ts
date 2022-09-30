import { Injectable, Inject, NotFoundException } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
//import { DeleteResult, MongoRepository, ObjectID } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Db, FindCursor, InsertOneResult, WithId } from 'mongodb';
import { randomUUID } from 'crypto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {

    private readonly collectionName = "bookings";
    
    public get bookingCol() {
      return this.db.collection<Booking>(this.collectionName);
    }

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
    ) {}

    async findOne(id: string): Promise<Booking> {
        const booking = (await this.bookingCol.findOne({_id: id})) as Booking;
        if (!booking) {
          throw new NotFoundException(`Booking with ID=${id} not found`);
        }
        return booking;
    }

    async findAll(): Promise<Booking[]> {
        const bookings = (await this.bookingCol.find().toArray()) as Booking[];
        return bookings;
      }

    async create(createBookingDto: CreateBookingDto): Promise<InsertOneResult<Booking>> {
        
        return await this.bookingCol.insertOne({
            _id: randomUUID(),
            departureCoordinates: createBookingDto.departureCoordinates,
            arrivalCoordinates: createBookingDto.arrivalCoordinates,
            departureTime: new Date (`${createBookingDto.departureTime}`),
            arrivalTime: new Date (`${createBookingDto.arrivalTime}`),
            price: createBookingDto.price,
            user: createBookingDto.user,
            created_at: new Date(),
            updated_at: new Date()
          })
    }
    
    async update(id: string, body: UpdateBookingDto): Promise<void> {
        await this.bookingCol.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    updated_at: new Date(),
                    ...body
                }
            },
        );
    }

    async delete(id: string): Promise<void> {

        const response = await this.bookingCol.deleteOne({
            _id: id,
        });
    
        if (response.deletedCount === 0) {
            throw new NotFoundException;
        }
    }

    async findUserBookings(id: string): Promise<Booking[]> {
        return await this.bookingCol.find({user: id}).toArray();
    }

    async findUserTravelledBookings(id: string): Promise<Booking[]> {
        const bookings = (await this.bookingCol.find(
            {
                user: id,
                arrivalTime: { $lt: new Date()}
            }
        ).toArray()) as Booking[];
        return bookings;
    }

    async findUserScheduledBookings(id: string): Promise<Booking[]> {
        const bookings = (await this.bookingCol.find(
            {
                user: id,
                arrivalTime: { $gt: new Date()}
            }
        ).toArray()) as Booking[];
        return bookings;
    }
}
