// Imports
import { NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ProductionGuard implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const header = req.headers;
    const request: any = req;
    const authentication = header['authorization'];
    if (!authentication?.token) return;
    const token = authentication?.token;
    //verify the token from crypt service
    const userData = { user_id: '', email: '' };
    request.body = { ...req.body, ...userData };
    return next();
  }
}
