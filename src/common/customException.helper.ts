import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export class CustomException extends HttpException {
	
  constructor(errCode: number, message: string, statusCode?: number) {
	  new Logger("CustomException").error('Applicative Exception: errCode='+errCode+' message='+message);
	  if (statusCode){
		  super({ statusCode, errCode, message, 'error':'Applicative Exception' }, statusCode);
	  } else {
		  super({ statusCode, errCode, message, 'error':'Applicative Exception' }, HttpStatus.INTERNAL_SERVER_ERROR);
	  }
  }
  
}