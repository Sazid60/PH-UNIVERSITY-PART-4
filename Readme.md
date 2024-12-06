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
