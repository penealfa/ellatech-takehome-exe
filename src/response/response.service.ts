import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success(data: any, message = 'Success', code = HttpStatus.OK) {
    return { code, message, data };
  }

  error(message = 'Error', code = HttpStatus.BAD_REQUEST, data = null) {
    return { code, message, data };
  }
}