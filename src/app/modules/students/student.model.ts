import { Schema, model } from 'mongoose';

// import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface';

// Sub-schema
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true, // Names often have unwanted whitespace
    maxlength: [20, 'First Name should not be more than 20 letters'],
  },
  middleName: {
    type: String,
    trim: true, // Middle names may also require trimming
  },
  // using npm validator
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is Required'],
    trim: true, // Trim for names
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is Required'],
    trim: true, // Occupations may have whitespace
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact No is Required'],
    trim: true, // Contact numbers may accidentally include whitespace
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is Required'],
    trim: true, // Trim for names
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is Required'],
    trim: true, // Occupations may have whitespace
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact No is Required'],
    trim: true, // Contact numbers may accidentally include whitespace
  },
});

const localGuardian = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is Required'],
    trim: true, // Names often need trimming
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is Required'],
    trim: true, // Occupations may have whitespace
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact No is Required'],
    trim: true, // Contact numbers may accidentally include whitespace
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is Required'],
    trim: true, // Addresses often need trimming
  },
});

// Main Schema

// if we use custom static instance model
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Id Is Required'],
      unique: true, // IDs don't typically require trimming
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Is Required'],
      unique: true,
      ref: 'User',
    },

    name: {
      type: userNameSchema,
      required: [true, 'Student Name is Required'],
    },

    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'], // No need for trimming in enum values
        message:
          '{VALUE} is not valid. Gender must be either "male", "female", or "other"',
      },
      required: [true, 'Gender is Required'],
    },

    dateOfBirth: {
      type: String,
      required: [true, 'Date of Birth is Required'],
    },

    // using npm validator
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true, // Email typically doesn't need trimming here
      trim: true, // Trim for ensuring valid input
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} is not a email type',
      // },
    },

    contactNo: {
      type: String,
      required: [true, 'Contact Number is Required'],
      trim: true, // Trim is essential for contact numbers
    },

    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact Number is Required'],
      trim: true, // Trim is essential for contact numbers
    },

    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message:
          'Blood Group must be one of "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"',
      },
    },

    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
      trim: true, // Addresses often need trimming
    },

    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is Required'],
      trim: true, // Addresses often need trimming
    },

    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian Information is Required'],
    },

    localGuardian: {
      type: localGuardian,
      required: [true, 'Local Guardian Information is Required'],
    },

    profileImg: {
      type: String,
    },

    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
  },
  {
    // this is used to enable mongoose virtuals
    toJSON: {
      virtuals: true,
    },
  },
);

studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//*************Creating an static method***********
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

//*************************************************
// Create a model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
