export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

//  these are not added inside the schema since these will be set automatically.
// export type NewUser = {
//   id: string;
//   role: string;
//   password?: string;
// };
//  we can do this without writing this using partial utility of typescript.

// create a user object
// const user:Partial<TUser>  = {};
