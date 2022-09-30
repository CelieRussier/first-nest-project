// src/app/users/users.service.ts

import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, InsertOneResult, ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import { Booking } from 'src/bookings/booking.entity';

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

    async findOne(id: string): Promise<User> {

        const user = (await this.userCol.findOne({_id: id})) as User;
        
        if (!user) {
          throw new NotFoundException(`User with ID=${id} not found`);
        }
        return user;
    }

    async findAll(): Promise<User[]> {
      const users = (await this.userCol.find().toArray()) as User[];
      return users;
    }

    async findAllRecentUpdateFirst(): Promise<User[]> {
      const users = (await this.userCol.find().sort("updated_at", -1).toArray()) as User[];
      return users;
    }

    async findAllOldUpdateFirst(): Promise<User[]> {
      const users = (await this.userCol.find().sort("updated_at", 1).toArray()) as User[];
      return users;
    }

    async create(createUserDto: CreateUserDto): Promise<InsertOneResult<User>> {

        return await this.userCol.insertOne({
          _id: randomUUID(),
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          birthday: new Date(createUserDto.birthday),
          created_at: new Date(),
          updated_at: new Date()
        })
    }
    
    async update(id: string, body: UpdateUserDto): Promise<void> {

      await this.userCol.updateOne(
          {
            _id: id,
            updated_at: new Date()
          },
          {
            $set: {
              updated_at: new Date(),
                ...body,
            }
          },
      );
    }


    async delete(id: string): Promise<void> {
    
        const response = await this.userCol.deleteOne({
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

/*

async update(id: string, updateUserDto: UpdateUserDto) {
        const convertedId: ObjectID = new ObjectId(id);
        const user = await this.usersRepository.preload({
          id: convertedId,
          ...updateUserDto,
        });
        if (!user) {
            throw new NotFoundException(`User with ID=${id} not found`);
          }
        return await this.usersRepository.save(user);
      }

 async create(createUserDto: CreateUserDto): Promise<InsertOneResult<User>> {
        //const user = this.usersRepository.create(createUserDto);
        //return await this.usersRepository.save(user);
  }


async deleteUser(id: string): Promise<string[] | DeleteResult> {
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