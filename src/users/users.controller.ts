import { Controller, Get, Post, Patch, Param, Body, Inject, Delete, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InsertOneResult, UpdateResult } from 'mongodb';
import { HttpExceptionFilter } from 'src/http-exception.filter';

@Controller('users')
@UseFilters(HttpExceptionFilter) //<------ peut être positionné sur une seule route ou même dans main.ts : app.useGlobalFilters(new HttpExceptionFilter());
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

    @Get('updated-between/:date_one/:date_two')
    async findAllWithinDateRange(@Param('date_one') date_one: string, @Param('date_two') date_two: string): Promise<User[]> {
        return await this.usersService.findAllWithinDateRange(date_one, date_two);
    }

    @Get('user-birthday/:id')
    async findUserNextBirthday(@Param('id') id: string): Promise<Date> {
        return await this.usersService.findUserNextBirthday(id);
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
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.usersService.update(id, updateUserDto);
        //return this.usersService.findOne(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void>  {
        return await this.usersService.delete(id);
    }

}
