import {GraphQLError} from 'graphql';
import { ObjectId } from 'mongodb';

import { parseDate } from './helpers/helpers.js';

import {
  instructors as instructorCollection,
  workshops as workshopCollection,
  participants as participantCollection
} from './config/mongoCollections.js';

import { 
  badInput,
  checkString, 
  notFound, 
  validateArgs, 
  validateDate, 
  validateDateJoined, 
  validateDateRange, 
  validateDOB, 
  validateDuration, 
  validateEmail, 
  validateId, 
  validateMember, 
  validatePhone, 
  validateWorkshopDates
} from './helpers/validation.js';

/*
-----------------------------------------------------
*/

const instructorValidators = {
  first_name: checkString,
  last_name: checkString,
  specialty: checkString,
  studio_name: checkString,
  email: validateEmail,
  phone: validatePhone,
  date_joined: validateDateJoined
};

const workshopValidators = {
  title: checkString,
  category: checkString,
  location: checkString,
  duration_hours: validateDuration,
  instructor: validateId,
  workshop_start: validateDate,
  workshop_end: validateDate,
  registration_open: validateDate,
  registration_close: validateDate
};

const participantValidators = {
  first_name: checkString,
  last_name: checkString,
  email: validateEmail,
  date_of_birth: validateDOB,
  membership_level: validateMember,
};

/* RESOLVERS */ 
export const resolvers = {

// *************************************
// *************** QUERY *************** 
// *************************************
  Query: {
    instructors: async () => {
      const instructors = await instructorCollection();
      const allInstructors = await instructors.find({}).toArray();

      return allInstructors;
    }, 
    workshops: async () => {
      const workshops = await workshopCollection();
      const allWorkshops = await workshops.find({}).toArray();

      return allWorkshops;
    },
    participants: async () => {
      const participants = await participantCollection();
      const allParticipants = await participants.find({}).toArray();

      return allParticipants;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    getInstructorById: async (_, args) => {
      // validate fields
      const _id = validateId(args._id, '_id');

      const instructors = await instructorCollection();
      const instructor = await instructors.findOne({ _id: new ObjectId(_id) });
      if (!instructor) {
        return null;
      }
      return instructor;
    },
    getWorkshopById: async (_, args) => {
      // validate fields
      const _id = validateId(args._id, '_id');

      const workshops = await workshopCollection();
      const workshop = await workshops.findOne({ _id: new ObjectId(_id) });
      if (!workshop) {
        return null;
      }
      return workshop;
    },
    getParticipantById: async (_, args) => {
      // validate fields
      const _id = validateId(args._id, '_id');

      const participants = await participantCollection();
      const participant = await participants.findOne({ _id: new ObjectId(_id) });
      if (!participant) {
        return null;
      }
      return participant;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    getWorkshopsByInstructorId: async (_, args) => {
      // validate fields
      const _id = validateId(args.instructorId, 'instructorId');

      const instructors = await instructorCollection();
      const instructorId = new ObjectId(_id);
      const instructor = await instructors.findOne({ _id: instructorId });
      if (!instructor) throw notFound(`No instructor with _id ${_id}`);

      const workshops = await workshopCollection();
      const workshopsInstructor = await workshops
        .find({ instructor: instructorId })
        .toArray();

      return workshopsInstructor;
    },
    getParticipantsByWorkshopId: async (_, args) => {
      const valWrk = validateId(args.workshopId, 'workshopId');
      const workshopId = new ObjectId(valWrk);
      // check workshop
      const workshops = await workshopCollection();
      const workshopExist = await workshops.findOne({ _id: workshopId });
      if (!workshopExist) throw notFound(`Workshop with id ${valWrk} not found`);

      // participants
      const participants = await participantCollection();
      const allParticipants = await participants.find({}).toArray();

      const participantsInWorkshop = allParticipants.filter(
        (pt) => pt.registered_workshops.some(
          (id) => id.equals(workshopId)
        )
      );

      return participantsInWorkshop;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    getInstructorsByStudio: async (_, args) => {
      // valdate studio
      const studio = checkString(args.studio, 'studio');

      const instructors = await instructorCollection();
      const instructorsInStudio = await instructors
        .find({ studio_name: studio }, { collation: { locale: 'en', strength: 2 } })
        .toArray();

      return instructorsInStudio;
    },
    getWorkshopsByCategory: async (_, args) => {
      // valdate category
      const category = checkString(args.category, 'category');

      const workshops = await workshopCollection();
      const workshopsCategory = await workshops
        .find({ category: category }, { collation: { locale: 'en', strength: 2 } })
        .toArray();

      return workshopsCategory;
    },
    getParticipantsByMembership: async (_, args) => {
      const level = validateMember(args.level, 'level');

      const participants = await participantCollection();
      const participantMembers = await participants
        .find({ membership_level: level })
        .toArray();
      
      return participantMembers;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    getInstructorsJoinedBetween: async (_, args) => {
      // validate dates
      const { start, end } = validateDateRange(args.start, args.end);
      const parsedStart = parseDate(start);
      const parsedEnd = parseDate(end);

      const instructors = await instructorCollection();
      const allInstructors = await instructors.find({}).toArray();

      const instructorsJoined = allInstructors.filter((instructor) => {
        const joinedDate = parseDate(instructor.date_joined);
        return joinedDate >= parsedStart && joinedDate <= parsedEnd;
      });

      return instructorsJoined;
    },
    getWorkshopsByRegistrationRange: async (_, args) => {
      // validate dates
      const { start, end } = validateDateRange(args.start, args.end);
      const parsedStart = parseDate(start);
      const parsedEnd = parseDate(end);

      const workshops = await workshopCollection();
      const allWorkshops = await workshops.find({}).toArray();

      const workshopsReg = allWorkshops.filter((workshop) => {
        const open = parseDate(workshop.registration_open);
        const close = parseDate(workshop.registration_close);
        return open >= parsedStart && close <= parsedEnd;
      });

      return workshopsReg;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    searchParticipantsByLastName: async (_, args) => {
      const term = checkString(args.searchTerm, 'searchTerm').toLowerCase();

      const participants = await participantCollection();
      const participantNames = await participants.find({}).toArray();
      
      const filteredNames = participantNames.filter((pt) => 
        pt.last_name.toLowerCase().includes(term)
      );

      return filteredNames;
    }
  },

// *****************************************
// *************** MUTATIONS ***************
// *****************************************
  Mutation: {
    addInstructor: async (_, args) => {
      // validate fields
      const newInstructor = {};
      for (const field of Object.keys(instructorValidators)) {
        newInstructor[field] = instructorValidators[field](args[field], field);
      }

      const instructors = await instructorCollection();
      const insertedInstructor = await instructors.insertOne(newInstructor);
      if (!insertedInstructor.acknowledged || !insertedInstructor.insertedId) {
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
      return newInstructor;
    }, 
    addWorkshop: async (_, args) => {
      // validate fields
      const newWorkshop = {};
      for (const field of Object.keys(workshopValidators)) {
        newWorkshop[field] = workshopValidators[field](args[field], field);
      }
      // validate workshop instructor
      const instructors = await instructorCollection();
      const instructorId = new ObjectId(newWorkshop.instructor)
      const instructor = await instructors.findOne({ _id: instructorId });
      if (!instructor) throw notFound(`No instructor with _id ${newWorkshop.instructor}`);
      newWorkshop.instructor = instructorId;
      // validate workshop dates
      validateWorkshopDates(
        newWorkshop.registration_open,
        newWorkshop.registration_close,
        newWorkshop.workshop_start,
        newWorkshop.workshop_end
      );

      const workshops = await workshopCollection();

      const insertedWorkshop = await workshops.insertOne(newWorkshop);
      if (!insertedWorkshop.acknowledged || !insertedWorkshop.insertedId) {
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
      return newWorkshop;
    },
    addParticipant: async (_, args) => {
      // validate fields
      const newParticipant = {};
      for (const field of Object.keys(participantValidators)) {
        newParticipant[field] = participantValidators[field](args[field], field);
      }

      // add registered_workshops
      newParticipant.registered_workshops = [];

      const participants = await participantCollection();
      const insertedParticipant = await participants.insertOne(newParticipant);
      if (!insertedParticipant.acknowledged || !insertedParticipant.insertedId) {
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
      return newParticipant;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    editInstructor: async (_, args) => {
      // validate ID
      const _id = validateId(args._id, '_id');
      const fields = validateArgs(args);

      // validate and update all fields
      const updates = {};
      for (const field of fields) {
        updates[field] = instructorValidators[field](args[field], field);
      }

      const instructors = await instructorCollection();
      const newInstructor = await instructors.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: updates },
        { returnDocument: 'after' }
      );

      if (!newInstructor) throw notFound(`No instructor found with _id ${_id}`);
      return newInstructor;
    },
    editWorkshop: async (_, args) => {
      // validate ID
      const _id = validateId(args._id, '_id');
      const fields = validateArgs(args);

      // validate and update all fields
      const updates = {};
      for (const field of fields) {
        updates[field] = workshopValidators[field](args[field], field);
      }

      // workshop must exist
      const workshops = await workshopCollection();
      const exists = await workshops.findOne({ _id: new ObjectId(_id) });
      if (!exists) throw notFound(`No workshop found with _id ${_id}`);

      if (updates.instructor !== undefined) {
        const instructors = await instructorCollection();
        const instructorId = new ObjectId(updates.instructor);
        const instructor = await instructors.findOne({ _id: instructorId });
        if (!instructor) throw notFound(`No instructor with _id ${updates.instructor}`);
        updates.instructor = instructorId;
      }

      const mergedData = { ...exists, ...updates };
      validateWorkshopDates(
        mergedData.registration_open,
        mergedData.registration_close,
        mergedData.workshop_start,
        mergedData.workshop_end
      );

      const newWorkshop = await workshops.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: updates },
        { returnDocument: 'after' }
      );
      return newWorkshop;
    },
    editParticipant: async (_, args) => {
      // validate ID
      const _id = validateId(args._id, '_id');
      const fields = validateArgs(args);

      // validate and update all fields
      const updates = {};
      for (const field of fields) {
        updates[field] = participantValidators[field](args[field], field);
      }

      const participants = await participantCollection();
      const newParticipant = await participants.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: updates },
        { returnDocument: 'after' }
      );

      if (!newParticipant) throw notFound(`No participant found with _id ${_id}`);
      return newParticipant;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    registerForWorkshop: async (_, args) => {
      const valPart = validateId(args.participantId, 'participantId');
      const valWrk= validateId(args.workshopId, 'workshopId');
      const participantId = new ObjectId(valPart);
      const workshopId = new ObjectId(valWrk);

      // check participant
      const participants = await participantCollection();
      const participantExist = await participants.findOne({ _id: participantId });
      if (!participantExist) throw notFound(`Participant with id ${valPart} not found`);
      // check workshop
      const workshops = await workshopCollection();
      const workshopExist = await workshops.findOne({ _id: workshopId });
      if (!workshopExist) throw notFound(`Workshop with id ${valWrk} not found`);

      // dup check
      if (participantExist.registered_workshops.some(
        (id) => id.equals(workshopId)
      )) return participantExist;

      // register in array
      const updatedParticipant = await participants.findOneAndUpdate(
        { _id: participantId },
        { $push: { registered_workshops: workshopId } },
        { returnDocument: 'after' }
      );

      return updatedParticipant;
    },
    unregisterFromWorkshop: async (_, args) => {
      const valPart = validateId(args.participantId, 'participantId');
      const valWrk= validateId(args.workshopId, 'workshopId');
      const participantId = new ObjectId(valPart);
      const workshopId = new ObjectId(valWrk);

      // check participant
      const participants = await participantCollection();
      const participantExist = await participants.findOne({ _id: participantId });
      if (!participantExist) throw notFound(`Participant with id ${valPart} not found`);
      // check workshop
      const workshops = await workshopCollection();
      const workshopExist = await workshops.findOne({ _id: workshopId });
      if (!workshopExist) throw notFound(`Workshop with id ${valWrk} not found`);

      // unregister from array
      const updatedParticipant = await participants.findOneAndUpdate(
        { _id: participantId },
        { $pull: { registered_workshops: workshopId } },
        { returnDocument: 'after' }
      );

      return updatedParticipant;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    reassignWorkshopInstructor: async (_, args) => {
      const valWrk = validateId(args.workshopId, 'workshopId');
      const valInst = validateId(args.instructorId, 'instructorId');
      const instructorId = new ObjectId(valInst);
      const workshopId = new ObjectId(valWrk);

      // check instructor
      const instructors = await instructorCollection();
      const instructorExist = await instructors.findOne({ _id: instructorId });
      if (!instructorExist) throw notFound(`Instructor with id ${valInst} not found`);
      // check workshop
      const workshops = await workshopCollection();
      const workshopExist = await workshops.findOne({ _id: workshopId });
      if (!workshopExist) throw notFound(`Workshop with id ${valWrk} not found`);

      const updatedWorkshop = await workshops.findOneAndUpdate(
        { _id: workshopId},
        { $set: { instructor: instructorId } },
        { returnDocument: 'after' }
      );

      return updatedWorkshop;
    },
/*
----------------------------------------------------------------------------------------------------------
*/
    removeInstructor: async (_, args) => {
      // validate ID
      const valId = validateId(args._id, '_id');
      const instructorId = new ObjectId(valId);

      const instructors = await instructorCollection();
      const deletedInstructor = await instructors.findOneAndDelete(
        { _id: instructorId }
      );

      if (!deletedInstructor) {
        throw notFound(`Could not delete instructor with id ${instructorId}`);
      }

      const workshops = await workshopCollection();
      await workshops.updateMany(
        { instructor: instructorId },
        { $set: { instructor: null } }
      );

      return deletedInstructor;
    },
    removeWorkshop: async (_, args) => {
      // validate ID
      const valId = validateId(args._id, '_id');
      const workshopId = new ObjectId(valId);

      const workshops = await workshopCollection();
      const deletedWorkshop = await workshops.findOneAndDelete(
        { _id: workshopId }
      );

      if (!deletedWorkshop) {
        throw notFound(`Could not delete workshop with id ${workshopId}`);
      }

      const participants = await participantCollection();
      await participants.updateMany(
        { registered_workshops: workshopId },
        { $pull: { registered_workshops: workshopId } }
      );
      
      return deletedWorkshop;
    },
    removeParticipant: async (_, args) => {
      // validate ID
      const valId = validateId(args._id, '_id');
      const participantId = new ObjectId(valId);

      const participants = await participantCollection();
      const deletedParticipant = await participants.findOneAndDelete(
        { _id: participantId }
      );

      if (!deletedParticipant) {
        throw notFound(`Could not delete participant with id ${participantId}`);
      }
      
      return deletedParticipant;
    }
  },

// *****************************************
// *************** TYPES ***************
// *****************************************

  Instructor: {
    workshops: async (parentValue) => {
      const workshops = await workshopCollection();
      const instructsWorkshops = await workshops
        .find({ instructor: parentValue._id })
        .toArray();
      return instructsWorkshops;
    },
    numOfWorkshops: async (parentValue) => {
      const workshops = await workshopCollection();
      const numOfWorkshops = await workshops.countDocuments({
        instructor: parentValue._id
      });
      return numOfWorkshops;
    }
  },
  Workshop: {
    instructor: async (parentValue) => {
      if (!parentValue.instructor) return null;
       const instructors = await instructorCollection();
       const workshopInstructor = await instructors.findOne({
        _id: parentValue.instructor
       });
       return workshopInstructor;
    },
    registeredParticipants: async (parentValue) => {
      const participants = await participantCollection();
      const allParticipants = await participants.find({}).toArray();

      const participantsInWorkshop = allParticipants.filter(
        (pt) => pt.registered_workshops.some(
          (id) => id.equals(parentValue._id)
        )
      )
      return participantsInWorkshop;
    },
    numOfRegisteredParticipants: async (parentValue) => {
      const participants = await participantCollection();
      const registeredParticipants = await participants.countDocuments(
        { registered_workshops: parentValue._id }
      );
      return registeredParticipants;
    }
  },
  Participant: {
    registered_workshops: async (parentValue) => {
      const workshops = await workshopCollection();
      const registeredWorkshops = await workshops.find(
        { _id: { $in: parentValue.registered_workshops } }
      ).toArray();
      return registeredWorkshops;
    },
    numOfRegisteredWorkshops: (parentValue) => {
      return parentValue.registered_workshops.length
    }
  }
};
