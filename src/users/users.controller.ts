import { Controller, Get, Post, Patch, Param, Body, Inject, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InsertOneResult, UpdateResult } from 'mongodb';

@Controller('users')
export class UsersController {
    @Inject()
    usersService: UsersService;

    /*@Get(':id/travelled-bookings')
    async getOldBookingsByUserId(@Param('id') id: string): Promise<User[]> {
        return await this.usersService.findUserTravelledBookings(id);
    }

    @Get(':id/scheduled-bookings')
    async getUpcomingBookingsByUserId(@Param('id') id: string): Promise<User[]> {
        return await this.usersService.findUserScheduledBookings(id);
    }

    @Get(':id/bookings')
    async getBookingsByUserId(@Param('id') id: string): Promise<User[]> {
        return await this.usersService.findUserBookings(id);
    }*/
    
    @Get('recent-update-first')
    async findAllRecentUpdateFirst(): Promise<User[]> {
        return await this.usersService.findAllRecentUpdateFirst();
    }

    @Get('old-update-first')
    async findAllOldUpdateFirst(): Promise<User[]> {
        return await this.usersService.findAllOldUpdateFirst();
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
    async create(@Body() user: User): Promise<InsertOneResult<User>> {
        return await this.usersService.create(user);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        await this.usersService.update(id, updateUserDto);
        return this.usersService.findOne(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void>  {
        return await this.usersService.delete(id);
    }

}
