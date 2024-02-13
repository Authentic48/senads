import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InternalJWTService } from '../../modules/jwt/jwt.service';
import { NextFunction, Request, Response } from 'express';
import { EJwtTokenTypes } from '../utils/enum';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(AuthMiddleware.name);
  constructor(private readonly jwtService: InternalJWTService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization: string = req.headers.authorization;

      if (!authorization) {
        req['isUserAuthenticated'] = false;
        return next();
      }

      const bearer: string[] = authorization.split(' ');

      if (!bearer || bearer.length < 2) {
        req['isUserAuthenticated'] = false;
        return next();
      }

      const token: string = bearer[1];

      const { isTokenValid, payload } = await this.jwtService.verifyToken(
        token,
        EJwtTokenTypes.ACCESS_TOKEN,
      );

      if (!isTokenValid) {
        req['isUserAuthenticated'] = false;
        return next();
      }

      req['isUserAuthenticated'] = true;
      req['userInfo'] = payload;
      return next();
    } catch (e) {
      this.logger.error(e);
      req['isUserAuthenticated'] = false;
      next();
    }
  }
}
