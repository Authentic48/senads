import {
  ArgumentsHost,
  ConflictException,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
  Catch,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaErrorFilter.name);
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    this.logger.error(exception.message);

    const response = host.switchToHttp().getResponse<Response>();

    let nestException: HttpException;

    if (
      exception instanceof PrismaClientKnownRequestError &&
      exception.code === 'P2002'
    ) {
      nestException = new ConflictException('already_exist');
    }

    if (
      exception instanceof PrismaClientKnownRequestError &&
      exception.code === 'P2025'
    ) {
      nestException = new NotFoundException('not_found');
    }

    response
      .status(nestException.getStatus())
      .json(nestException.getResponse());
  }
}
