import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);
  catch(
    exception: PrismaClientKnownRequestError | HttpException,
    host: ArgumentsHost,
  ): void {
    this.logger.error(exception.message);

    const response = host.switchToHttp().getResponse<Response>();

    let nestException: BadRequestException = new BadRequestException(
      'something_went_wrong',
    );

    if (exception instanceof ForbiddenException)
      nestException = new ForbiddenException();

    if (exception instanceof UnauthorizedException)
      nestException = new ForbiddenException(exception.message);

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
