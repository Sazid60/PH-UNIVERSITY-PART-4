import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

//  this is made higher order function
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   validation using zod
      // if everything alright next()
      await schema.parseAsync({
        body: req.body,
        //    as it is kept inside a body zod must be kept inside a body
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
