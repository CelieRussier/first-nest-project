import { Controller, Get, Post, Patch, Param, Body, Inject, Delete, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Document, InsertOneResult, UpdateResult } from 'mongodb';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import moment from 'moment';

@Controller('users')
@UseFilters(HttpExceptionFilter) //<------ peut être positionné sur une seule route ou même dans main.ts : app.useGlobalFilters(new HttpExceptionFilter());
export class UsersController {
    @Inject()
    usersService: UsersService;

    @Get('testLodash')
    async testLodash(){
        return await this.usersService.testLodash();
    }
    
    @Get('users-aggregated-by-distance-from/:x')
    async findUsersAggregatedByDistance(@Param('x') x: string) : Promise<Document[]> {
        return await this.usersService.findUsersAggregatedByDistance(x);
    }

    @Get ('maxDistance/:maxDistance/maxDistanceOrigin/:maxDistanceOrigin')
    async findClosestUsersFromPosition(
        @Param('maxDistance') maxDistance: string, 
        @Param('maxDistanceOrigin') maxDistanceOrigin: string)
        : Promise<User[]> {
        return await this.usersService.findClosestUsersFromPosition(maxDistance, maxDistanceOrigin);
    }

    @Get('recent-update-first')
    async findAllRecentUpdateFirst(): Promise<User[]> {
        return await this.usersService.findAllRecentUpdateFirst();
    }

    @Get('old-update-first')
    async findAllOldUpdateFirst(): Promise<User[]> {
        return await this.usersService.findAllOldUpdateFirst();
    }

    @Get('updated-between/:date_one/:date_two')
    async findAllWithinDateRange(@Param('date_one') date_one: string, @Param('date_two') date_two: string): Promise<User[]> {
        return await this.usersService.findAllWithinDateRange(date_one, date_two);
    }

    @Get('user-birthday/:id')
    async findUserNextBirthday(@Param('id') id: string) {
        return await this.usersService.findUserNextBirthday(id);
    }

    @Get('fullname/:id')
    async getFullName(@Param('id') id: string): Promise<string> {
        return await this.usersService.findUserFullName(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.findOne(id);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Post()
    @ApiResponse({type: User})
    async create(@Body()  createUserDto: CreateUserDto): Promise<InsertOneResult<User>> {
        return await this.usersService.create(createUserDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.usersService.update(id, updateUserDto);
        //return this.usersService.findOne(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void>  {
        return await this.usersService.delete(id);
    }

}
