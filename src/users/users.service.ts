// src/app/users/users.service.ts

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, MongoRepository, ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private usersRepository: MongoRepository<User>) { }

    async getUsers(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    /*-----> NOT USED <------
    async getUser(id: ObjectID): Promise<User[]> {
        return await this.usersRepository.find({
          // Properties to return. We don't want the password property.
            select: ["firstname", "lastname", "bookings"],
            where: [{ "id": id }]
        });
    }*/

    async findOne(id: string): Promise<User> {
        const convertedId: ObjectID = new ObjectId(id);
        const user = await this.usersRepository.findOneBy({_id: convertedId});
        if (!user) {
          throw new NotFoundException(`User with ID=${id} not found`);
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        return await this.usersRepository.save(user);
    }

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

    async findUserBookings(id: string) {
        const user = await this.usersRepository
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.bookings", "bookings")
        .where({"_id": id})
        .getMany()
        return user;
    }
    
    async findUserTravelledBookings(id: string) {
        const user = await this.usersRepository
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.bookings", "bookings")
        .where({"_id": id})
        .andWhere("bookings.departureTime < now()")
        .getMany()
        return user;
    }

    async findUserScheduledBookings(id: string) {
        const user = await this.usersRepository
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.bookings", "bookings")
        .where({"_id": id})
        .andWhere("bookings.departureTime > now()")
        .getMany()
        return user;
    }

    async deleteUser(id: string): Promise<string[] | DeleteResult> {
        const convertedId: ObjectID = new ObjectId(id);
        const user: User = await this.usersRepository.findOneBy({_id: convertedId});
        /*const err: string[] = [];
        if (user.bookings.length = 0) {
            const message = "This user cannot be deleted : he has registered bookings";
            err.push(message);
            return err;
        };*/
        return this.usersRepository.delete(id);
    }


}