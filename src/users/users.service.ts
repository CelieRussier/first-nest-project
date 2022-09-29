// src/app/users/users.service.ts

import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, InsertOneResult, ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import { Booking } from 'src/bookings/booking.entity';

//import { DeleteResult, MongoRepository, ObjectID } from 'typeorm';
@Injectable()
export class UsersService {
    private readonly collectionName = "users";
    
    public get userCol() {
      return this.db.collection<User>(this.collectionName);
    }

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
      ) {
      }

    async getUsers(): Promise<User[]> {
        const users = (await this.userCol.find().toArray()) as User[];
        return users;
        // return users.map(user => {
        //   return {
        //     firstname: user.firstname,

        //   } as User
        // })
    }

    async findOne(id: string): Promise<User> {
        //const convertedId: ObjectId = new ObjectId(id);

        const user = (await this.userCol.findOne({id: id})) as User;
        
        if (!user) {
          throw new NotFoundException(`User with ID=${id} not found`);
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<InsertOneResult<User>> {
        //const user = this.usersRepository.create(createUserDto);
        //return await this.usersRepository.save(user);
      
        return await this.userCol.insertOne({
          id: randomUUID(),
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname
        })
    }

    /*async update(id: string, updateUserDto: UpdateUserDto) {
        const convertedId: ObjectID = new ObjectId(id);
        const user = await this.usersRepository.preload({
          id: convertedId,
          ...updateUserDto,
        });
        if (!user) {
            throw new NotFoundException(`User with ID=${id} not found`);
          }
        return await this.usersRepository.save(user);
      }*/
    
    async update(id: string, body: UpdateUserDto): Promise<void> {

    await this.userCol.updateOne(
        {
        id: id,
        },
        {
        $set: {
            ...body,
        },
        },
    );
    }


    async delete(id: string): Promise<void> {
    
        const response = await this.db.collection('users').deleteOne({
          _id: id,
        });
    
        if (response.deletedCount === 0) {
          throw new NotFoundException;
        }
    }

}

/*-----> NOT USED <------
    async getUser(id: ObjectID): Promise<User[]> {
        return await this.usersRepository.find({
          // Properties to return. We don't want the password property.
            select: ["firstname", "lastname", "bookings"],
            where: [{ "id": id }]
        });
    }*/

/*async deleteUser(id: string): Promise<string[] | DeleteResult> {
        const convertedId: ObjectID = new ObjectId(id);
        const user: User = await this.usersRepository.findOneBy({_id: convertedId});
        const err: string[] = [];
        if (user.bookings.length = 0) {
            const message = "This user cannot be deleted : he has registered bookings";
            err.push(message);
            return err;
        };
        return this.usersRepository.delete(id);

async create(createUserDto: CreateUserDto): Promise<User> {
        //const user = this.usersRepository.create(createUserDto);
        //return await this.usersRepository.save(user);
        return await this.db.collection('users').insert(createUserDto);
    }
    }

async findUserBookings(id: string) {
        const user = await this.userCol
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.bookings", "bookings")
        .where({"_id": id})
        .getMany()
        return user;
    }
    
    async findUserTravelledBookings(id: string) {
        const user = await this.db.collection('users')
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.bookings", "bookings")
        .where({"_id": id})
        .andWhere("bookings.departureTime < now()")
        .getMany()
        return user;
    }

    async findUserScheduledBookings(id: string) {
        const user = await this.db.collection('users')
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.bookings", "bookings")
        .where({"_id": id})
        .andWhere("bookings.departureTime > now()")
        .getMany()
        return user;
    }


 */