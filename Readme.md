# PH-UNIVERSITY-4

## 14-1 What is Error Handling

### WE WILL KNOW

- Error Handling
- Searching
- Filtering
- Pagination
- Practice Task will be given

#### Error Handling

![alt text](<WhatsApp Image 2024-12-06 at 10.46.27_40dc66af.jpg>)

#### Operational Error (We can Handle it in express application)

- Errors that we can predict will happen in future
  1. Invalid User Input
  2. Failed to run server
  3. Failed to connect database
  4. Invalid auth token

#### Programmatic Error (We can Handle it in express application)

- Errors that developers produces when developing

  1. using undefined variables
  2. using properties that do not exist
  3. passing number instead of string
  4. using req.params instead of req.query

- Operational and Programmatic Error wll happen inside the application so these can be handles inside express application

#### Unhandled Rejection(Asynchronous code)

#### Uncaught Expectation (synchronous Code)

- These two can be inside or outside the express application

![alt text](<WhatsApp Image 2024-12-06 at 11.00.50_33105565.jpg>)

![alt text](<WhatsApp Image 2024-12-06 at 11.05.26_768ac183.jpg>)

![alt text](<WhatsApp Image 2024-12-06 at 11.06.52_2695731d.jpg>)

- for production we will not give the stack

## 14-2 Understanding Error Patterns in Zod and Mongoose

- ZodError is a subclass of Error; you can create your own instance easily:
- To checking class or instance we have to use instanceof operator

```ts
type TErrorSource = {
  path: string | number;
  message: string;
}[];

let errorSource: TErrorSource = [
  {
    path: '',
    message: 'Something Went Wrong',
  },
];

// ZodError is a subclass of Error; you can create your own instance easily
// To checking class or instance we have to use instanceof operator
if (err instanceof ZodError) {
  statusCode = 400;
  message = 'Ami Zod Error';
}
```

[ZOD ERROR HANDLING](https://zod.dev/ERROR_HANDLINGhttps://zod.dev/ERROR_HANDLING)

- First we have to trace in which structure our error is coming and then we will organize our error handler based on that

## 14-3 How to Convert Zod Error

- First We Will Detect The Error and then using the handler we will modify the error according to us

```ts
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
      message: 'Validation Error',
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
```

## 14-4 How to convert mongoose validation error

- Mongoose isa The First Layer and Zod is on Top Of Mongoose
- Practically zod will handle most of the errors a fewer time will be handled by mongoose

```ts
import mongoose from 'mongoose';
import { TErrorSources } from '../interface/error';

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Zod Validation Error',
    errorSources,
  };
};

export default handleValidationError;
```

## 14-5 How to handle castError and 11000 error

- Validating Error Response Type

```ts
import mongoose from 'mongoose';
import { TErrorSources } from '../interface/error';

type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Mongoose Validation Error',
    errorSources,
  };
};

export default handleValidationError;
```

- Handling cast error means It will handle invalid id error

```ts
import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  };
};

export default handleCastError;
```
