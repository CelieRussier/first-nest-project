import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map, Observable } from "rxjs";

@Injectable()
export class ApiService {
    constructor(private readonly httpService: HttpService) {}

    findIp(): Observable<AxiosResponse> {
        return this.httpService.get('https://api.ipify.org?format=json')
        .pipe(map(
            (response => response.data)
            )
        )        
    };
}