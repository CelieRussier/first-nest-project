import { Controller, Get, Post, Patch, Param, Body, Inject, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, ObjectID } from 'typeorm';

@Controller('users')
export class UsersController {
    @Inject()
    usersService: UsersService;

    @Get(':id/bookings')
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
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.findOne(id);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.getUsers();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<string[] | DeleteResult>  {
        return await this.usersService.deleteUser(id);
    }
}
