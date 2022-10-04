// src/app/users/users.service.ts

import { Injectable, Inject, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, Document, InsertOneResult, UpdateResult } from 'mongodb';
import { randomUUID } from 'crypto';
import { GeoJsonObject } from 'geojson';
import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer';
import moment from 'moment';
import _ from 'lodash';

@Injectable()
export class UsersService {

  async testLodash() {
    let object = { 'a': [{ 'b': { 'c': 3 } }] };
    await _.set(object, 'a[0].b.c', 4);
    const js = parseFloat('08');
    const lodash = _.parseInt('08,123456789');
    console.log('js', js);
    console.log('lodash', lodash);
    return object;
  }
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

  async findUserFullName(id: string): Promise<string> {
    const user = (await this.userCol.findOne({_id: id})) as User;
    const userToClass = plainToInstance(User, user);
    return userToClass.fullName;
  }

  async findUserNextBirthday(id: string) {

    const user = (await this.userCol.findOne({_id: id})) as User;
    
    /*const nextBirthday = () => {

      const currentDay = new Date();
      const currentYear = new Date().getFullYear();

      const userBirthday = new Date(user.birthday);

      const birthdayCurrentYear = new Date(userBirthday.setFullYear(currentYear));
      const birthdayNextYear = new Date(userBirthday.setFullYear(currentYear + 1));

      if (currentDay < birthdayCurrentYear) {
        return birthdayCurrentYear;
      } else {
        return birthdayNextYear;
      }
    }*/

      const userBirthdate = moment(user.birthday);

      const years = moment().diff(userBirthdate, 'years');

      const nextBirthday = moment(userBirthdate).add(years + 1, 'years').format('YYYY-MM-DD');

    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return nextBirthday;
}

  async findAll(): Promise<User[]> {

    const users = (await this.userCol.find().toArray()).map(u => plainToInstance(User, u));


    if (!users) {
      //throw new NotFoundException("No users registered yet");
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return users;
  }

  async findAllRecentUpdateFirst(): Promise<User[]> {
    const users = (await this.userCol.find().sort("updated_at", -1).toArray()) as User[];

    if (!users) {
      throw new NotFoundException("No users registered yet");
    }

    return users;
  }

  async findAllOldUpdateFirst(): Promise<User[]> {
    const users = (await this.userCol.find().sort("updated_at", 1).toArray()) as User[];

    if (!users) {
      throw new NotFoundException("No users registered yet");
    }

    return users;
  }

  async findAllWithinDateRange(date_one: string, date_two: string): Promise<User[]> {
    const users = (await this.userCol.find(
      {
        updated_at: {
          $gt: new Date(date_one),
          $lt: new Date(date_two)
        }
      }
    ).toArray()) as User[];

    if (!users) {
      throw new NotFoundException(`Not users updated within this date range`);
    }

    return users;
  }

  async findClosestUsersFromPosition (maxDistance: string, maxDistanceOrigin: string): Promise<User[]> {
    //this.userCol.createIndex({ position: "2dsphere" }); => inséré directement via Compass

    const splitMaxDistanceOrigin = maxDistanceOrigin.split(',');
    const maxDistanceOriginArrayNumber = [parseFloat(splitMaxDistanceOrigin[0]),parseFloat(splitMaxDistanceOrigin[1])];
    
    const users = (await this.userCol.find(
      {
        position: {
          $near: {
              $geometry:{ 
                  type: "Point", 
                  coordinates: maxDistanceOriginArrayNumber //ex: [45.757, 4.832]
              },
              $maxDistance: parseInt(maxDistance)
          }
      }
      }
    ).toArray()) as User[];

    return users;
  }

  async findUsersAggregatedByDistance(x: string): Promise<Document[]> {
    const splitX = x.split(',');
    const xArrayNumber = [parseFloat(splitX[0]),parseFloat(splitX[1])];
    const xPoint: Object = {
      "type" : "Point",
      "coordinates" : [
        xArrayNumber[0],
        xArrayNumber[1]
      ]
    } as GeoJsonObject;

    const users = (await this.userCol.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: xArrayNumber },
          key: "position",
          distanceField: "dist.calculated",
          spherical: true
       }
      },
      {
        $addFields: {
          rounded_distance: { $round: ["$dist.calculated", -2] }
        }
      },
      {
        $group: {
          _id: "$rounded_distance",
          users: { $push: "$_id"}
        }
      },
      {
        $project: {
          '_id': false,
          'distance_rounded': '$_id',
          users: '$users'
        }
      },
      /*{
        $set: {
          'distance_rounded_2': {
            $cond: [
              
            ]
          },
         }
      },*/
      { 
        $sort : { distance_rounded : 1 }
      }
      
    ]).toArray());
    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<InsertOneResult<CreateUserDto>> {
    //var GeoJSON = require('geojson');
    
    const u = plainToInstance(User, {
      _id: randomUUID(),
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      birthday: createUserDto.birthday,
      created_at: new Date(),
      updated_at: null,
      lat: createUserDto.lat,
      lng: createUserDto.lng,
      position: {
        "type" : "Point",
        "coordinates" : [
          createUserDto.lat,
          createUserDto.lng
        ]
      },
    })
    const toSaved = instanceToPlain(u, {groups: ['db']}) as User
    const response = await this.userCol.insertOne(toSaved);

    return response;
  }
  
  async update(id: string, body: UpdateUserDto): Promise<UpdateResult> {

    const response = await this.userCol.updateOne(
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
    )

    if (response.modifiedCount === 0) {
      throw new NotFoundException();
    }

    return response;
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