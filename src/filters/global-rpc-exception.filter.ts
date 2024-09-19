import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error: any = exception.getError();
    
    // Transform or log the error as needed
    return throwError(() => ({
      status: 'error',
      message: error.message || 'An error occurred in the microservice',
      details: error.details || null,
      code: error.status || 'UNKNOWN_ERROR',
    }));
  }
}
