import { Controller, Get, Inject, Injectable } from "@nestjs/common";
import { ApiService } from "./api.service";

@Controller('ip')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Get()
    getBookingsByUserId() {
        return this.apiService.findIp();
    }

}
