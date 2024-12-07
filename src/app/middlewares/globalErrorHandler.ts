/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';

// global error handler
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // this handler will convert the error to our desired error
  const handleZodError = (err: ZodError) => {
    const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        // we are taking the last index of the issue because last index holds the actual path in zod error
        message: issue.message,
      };
    });
    const statusCode = 400;
    return {
      statusCode,
      message: 'Zod Validation Error',
      errorSources,
    };
  };
  // ZodError is a subclass of Error; you can create your own instance easily

  // To checking class or instance we have to use instanceof operator
  //  detecting the error
  if (err instanceof ZodError) {
    // this will over write the error
    const simplifiedError = handleZodError(err);
    // console.log(simplifiedError);
    // will be simplified by handle error
    // over wite the errors
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Send the response without returning it
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

// error Format
/*
success
message
errorSources :[
path:'',
message:'',
]
stack*/
