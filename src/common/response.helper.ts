import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class ResponseHelper {
  SendHttpResponse(message: string, statuscode: any, data: any): any {
    throw new HttpException(
      {
        isSuccessful: true,
        statusCode: statuscode,
        message: message,
        data: data,
      },
      statuscode,
    );
  }

  SendHttpError(message: string, statuscode: any, data = null): any {
    throw new HttpException(
      {
        isSuccessful: false,
        statusCode: statuscode,
        message: message,
        data: data,
      },
      statuscode,
    );
  }
}
