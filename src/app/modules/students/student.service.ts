import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';

// *******************************************************************
// getting data service
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // {email :{$regex : query.searchTerm, $option:i}}
  // {presentAddress :{$regex : query.searchTerm, $option:i}}
  // {'name.firstName' :{$regex : query.searchTerm, $option:i}}

  console.log('Base Query :', query);

  // making  a copy of the query so that original query do not change

  const queryObj = { ...query };
  const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  // we are using chaining
  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filtering
  const excludeFields = ['searchTerm', 'sort', 'limit'];
  excludeFields.forEach((el) => delete queryObj[el]);
  // console.log({ query, queryObj });

  // http://localhost:5000/api/v1/students?searchTerm=sazid&email=sazid@e.com
  //  for sorting http://localhost:5000/api/v1/students?sort=-email this means descending order
  // for limiting http://localhost:5000/api/v1/students?limit=1

  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  // nested populate is done since academic faculty inside academic department is still showing id

  let sort = '-createdAt';

  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  // limiting
  let limit = 1;
  if (query.limit) {
    limit = query.limit;
  }

  const limitQuery = await sortQuery.limit(limit);

  return limitQuery;
};

// get single student from db
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });

  // using aggregate
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// update single student in db
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  /*
          "guardian" : {
            "fatherOccupation": "Kod becha"
        }

        transform to 
        "guardian.fatherOccupation": "Kodu Becha"
        using backend
   */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  //   This block checks if name exists and has any properties (by checking Object.keys(name).length).
  // If name is a valid object with properties, it loops over each entry in the name object (using Object.entries(name)), which gives an array of [key, value] pairs.
  // For each key-value pair in the name object, it updates modifiedUpdatedData by adding a new property in dot notation. For example, if name contains a first key with the value "John", it will add a property "name.first" with the value "John" to modifiedUpdatedData.
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

// delete single student from db
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed To Delete Student',
        '',
      );
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Delete User', '');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed To Delete Student');
  }
};
export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
