import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;

  // will call service function to send this data
  const result = await UserServices.createStudentInDB(studentData, password);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Is Created Successfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
};
