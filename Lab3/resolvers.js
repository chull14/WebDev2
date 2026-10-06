import {GraphQLError} from 'graphql';

import {
  instructors as instructorCollection,
  workshops as workshopCollection,
  participants as participantCollection
} from './config/mongoCollections.js';
import { ObjectId } from 'mongodb';
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
import { parseDate } from './helpers/helpers.js';

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

export const resolvers = {
  // QUERIES
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

    getInstructorsByStudio: async (_, args) => {
      // valdate studio
      const studio = checkString(args.studio, 'studio');

      const instructors = await instructorCollection();
      const instructorsInStudio = await instructors
        .find({ studio_name: studio }, { collation: { locale: 'en', strength: 2 } })
        .toArray();

      return instructorsInStudio;
    },
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

    getInstructorsJoinedBetween: async (_, args) => {
      // validate dates
      const { start, end } = validateDateRange(args.start, args.end);
      const parsedStart = parseDate(start);
      const parsedEnd = parseDate(end);

      const instructors = await instructorCollection();
      const allInstructors = await instructors.find({}).toArray();

      return allInstructors.filter((instructor) => {
        const joinedDate = parseDate(instructor.date_joined);
        return joinedDate >= parsedStart && joinedDate <= parsedEnd;
      });
    },
    getWorkshopsByRegistrationRange: async (_, args) => {
      // validate dates
      const { start, end } = validateDateRange(args.start, args.end);
      const parsedStart = parseDate(start);
      const parsedEnd = parseDate(end);

      const workshops = await workshopCollection();
      const allWorkshops = await workshops.find({}).toArray();

      return allWorkshops.filter((workshop) => {
        const open = parseDate(workshop.registration_open);
        const close = parseDate(workshop.registration_close);
        return open >= parsedStart && close <= parsedEnd;
      });
    },

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

  // MUTATIONS 
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
    }
  }
};
