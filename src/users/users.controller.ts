import { Controller, Get, Post, Patch, Param, Body, Inject, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InsertOneResult } from 'mongodb';

@Controller('users')
export class UsersController {
    @Inject()
    usersService: UsersService;

    /*@Get(':id/bookings')
    async getBookingsByUserId(@Param('id') id: string): Promise<User[]> {
        return await this.usersService.findUserBookings(id);
    }

    @Get(':id/travelled-bookings')
    async getOldBookingsByUserId(@Param('id') id: string): Promise<User[]> {
        return await this.usersService.findUserTravelledBookings(id);
    }

    @Get(':id/scheduled-bookings')
    async getUpcomingBookingsByUserId(@Param('id') id: string): Promise<User[]> {
        return await this.usersService.findUserScheduledBookings(id);
    }*/

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.findOne(id);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.getUsers();
    }

    @Post()
    create(@Body() user: User): Promise<InsertOneResult<User>> {
        return this.usersService.create(user);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void>  {
        return await this.usersService.delete(id);
    }
}
