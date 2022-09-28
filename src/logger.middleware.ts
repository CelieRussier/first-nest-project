import { Injectable, NestMiddleware, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware,OnModuleInit, OnModuleDestroy {
  private count: number = 0;
  private timer: NodeJS.Timer;


  constructor() {
    
  }

  onModuleInit() {
    this.startTimer();
  }
  onModuleDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
        console.log('Nombre de requêtes :', this.count);
    }, 5000);
  }
  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
    console.log('timer stop');
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.count += 1;

    next();
  }
}
