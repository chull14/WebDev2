import { gql } from '@apollo/client'

// fragments for shared field lists
const INSTRUCTOR_FIELDS = gql`
    fragment InstructorFields on Instructor { 
        _id
        first_name
        last_name
        specialty
        studio_name
        email
        phone
        date_joined
        numOfWorkshops
    }
`;


const WORKSHOP_FIELDS = gql`
    fragment WorkshopFields on Workshop {
        _id
        title
        category
        location
        duration_hours
        workshop_start
        workshop_end
        registration_open
        registration_close
        numOfRegisteredParticipants
        instructor {
            _id
            first_name
            last_name
            specialty
            studio_name
        }
    }
`;

const PARTICIPANT_FIELDS = gql`
    fragment ParticipantFields on Participant {
        _id
        first_name
        last_name
        email
        date_of_birth
        membership_level
        numOfRegisteredWorkshops
    }
`;

// GET queries
export const GET_INSTRUCTORS = gql`
    query GetInstructors {
        instructors { ...InstructorFields }
    }
    ${INSTRUCTOR_FIELDS}
`;

export const GET_WORKSHOPS = gql`
    query GetWorkshops {
        workshops { ...WorkshopFields }
    }
    ${WORKSHOP_FIELDS}
`;


export const GET_PARTICIPANTS = gql`
    query GetParticipants {
        participants { ...ParticipantFields }
    }
    ${PARTICIPANT_FIELDS}
`;



// GET by id queries
export const GET_INSTRUCTOR_BY_ID = gql`
    query GetInstructorById($id: String!) {
        getInstructorById(_id: $id) {
            ...InstructorFields
            workshops { ...WorkshopFields }
        }
    }
    ${INSTRUCTOR_FIELDS}
    ${WORKSHOP_FIELDS}
`;

export const GET_WORKSHOP_BY_ID = gql`
    query GetWorkshopById($id: String!) {
        getWorkshopById(_id: $id) {
            ...WorkshopFields
            registeredParticipants { ...ParticipantFields }
        }
    }
    ${WORKSHOP_FIELDS}
    ${PARTICIPANT_FIELDS}
`;

export const GET_PARTICIPANT_BY_ID = gql`
    query GetParticipantById($id: String!) {
        getParticipantById(_id: $id) {
            ...ParticipantFields
            registered_workshops { ...WorkshopFields }
        }
    }
    ${PARTICIPANT_FIELDS}
    ${WORKSHOP_FIELDS}
`;



// GET relational queries
export const GET_WORKSHOPS_BY_INSTRUCTOR_ID = gql`
    query GetWorkshopByInstructorId($instructorId: String!) {
        getWorkshopsByInstructorId(instructorId: $instructorId) {
            ...WorkshopFields
        }
    }
    ${WORKSHOP_FIELDS}
`;

export const GET_PARTICIPANTS_BY_WORKSHOP_ID = gql`
    query GetParticipantsByWorkshopId($workshopId: String!) {
        getParticipantsByWorkshopId(workshopId: $workshopId) {
            ...ParticipantFields
        }
    }
    ${PARTICIPANT_FIELDS}
`;


// GET with filtering queries
export const GET_INSTRUCTORS_BY_STUDIO = gql`
  query GetInstructorsByStudio($studio: String!) {
    getInstructorsByStudio(studio: $studio) { 
        ...InstructorFields 
    }
  }
  ${INSTRUCTOR_FIELDS}
`;

export const GET_INSTRUCTORS_JOINED_BETWEEN = gql`
  query GetInstructorsJoinedBetween($start: String!, $end: String!) {
    getInstructorsJoinedBetween(start: $start, end: $end) { 
        ...InstructorFields 
    }
  }
  ${INSTRUCTOR_FIELDS}
`;

export const GET_WORKSHOPS_BY_CATEGORY = gql`
  query GetWorkshopsByCategory($category: String!) {
    getWorkshopsByCategory(category: $category) { 
        ...WorkshopFields 
    }
  }
  ${WORKSHOP_FIELDS}
`;

export const GET_WORKSHOPS_BY_REGISTRATION_RANGE = gql`
  query GetWorkshopsByRegistrationRange($start: String!, $end: String!) {
    getWorkshopsByRegistrationRange(start: $start, end: $end) { 
        ...WorkshopFields 
    }
  }
  ${WORKSHOP_FIELDS}
`;

export const GET_PARTICIPANTS_BY_MEMBERSHIP = gql`
  query GetParticipantsByMembership($level: String!) {
    getParticipantsByMembership(level: $level) { 
        ...ParticipantFields
    }
  }
  ${PARTICIPANT_FIELDS}
`;


export const SEARCH_PARTICIPANTS_BY_LAST_NAME = gql`
  query SearchParticipantsByLastName($searchTerm: String!) {
    searchParticipantsByLastName(searchTerm: $searchTerm) { 
        ...ParticipantFields 
    }
  }
  ${PARTICIPANT_FIELDS}
`;



// ADD INSTRUCTOR MUTATION
export const ADD_INSTRUCTOR = gql`
    mutation AddInstructor(
        $first_name: String!
        $last_name: String!
        $specialty: String!
        $studio_name: String!
        $email: String!
        $phone: String!
        $date_joined: String!
    ) {
        addInstructor(
            first_name: $first_name
            last_name: $last_name
            specialty: $specialty
            studio_name: $studio_name
            email: $email
            phone: $phone
            date_joined: $date_joined
        ) { ...InstructorFields }
    }
    ${INSTRUCTOR_FIELDS}
`;



// PATCH INSTRUCTOR MUTATION
export const EDIT_INSTRUCTOR = gql`
  mutation EditInstructor(
    $_id: String!
    $first_name: String
    $last_name: String
    $specialty: String
    $studio_name: String
    $email: String
    $phone: String
    $date_joined: String
  ) {
    editInstructor(
      _id: $_id
      first_name: $first_name
      last_name: $last_name
      specialty: $specialty
      studio_name: $studio_name
      email: $email
      phone: $phone
      date_joined: $date_joined
    ) { ...InstructorFields }
  }
  ${INSTRUCTOR_FIELDS}
`;



// REMOVE INSTRUCTOR MUTATION
export const REMOVE_INSTRUCTOR = gql`
  mutation RemoveInstructor($_id: String!) {
    removeInstructor(_id: $_id) { 
        _id 
        first_name 
        last_name 
    }
  }
`;



// ADD WORKSHOP MUTATION
export const ADD_WORKSHOP = gql`
  mutation AddWorkshop(
    $title: String!
    $category: String!
    $location: String!
    $duration_hours: Int!
    $instructor: String!
    $workshop_start: String!
    $workshop_end: String!
    $registration_open: String!
    $registration_close: String!
  ) {
    addWorkshop(
      title: $title
      category: $category
      location: $location
      duration_hours: $duration_hours
      instructor: $instructor
      workshop_start: $workshop_start
      workshop_end: $workshop_end
      registration_open: $registration_open
      registration_close: $registration_close
    ) { ...WorkshopFields }
  }
  ${WORKSHOP_FIELDS}
`;

// PATCH WORKSHOP MUTATION
export const EDIT_WORKSHOP = gql`
  mutation EditWorkshop(
    $_id: String!
    $title: String
    $category: String
    $location: String
    $duration_hours: Int
    $instructor: String
    $workshop_start: String
    $workshop_end: String
    $registration_open: String
    $registration_close: String
  ) {
    editWorkshop(
      _id: $_id
      title: $title
      category: $category
      location: $location
      duration_hours: $duration_hours
      instructor: $instructor
      workshop_start: $workshop_start
      workshop_end: $workshop_end
      registration_open: $registration_open
      registration_close: $registration_close
    ) { ...WorkshopFields }
  }
  ${WORKSHOP_FIELDS}
`;

// REMOVE WORKSHOP MUTATION
export const REMOVE_WORKSHOP = gql`
  mutation RemoveWorkshop($_id: String!) {
    removeWorkshop(_id: $_id) { 
        _id 
        title 
    }
  }
`;

// PATCH WORKSHOP MUTATION
export const REASSIGN_WORKSHOP_INSTRUCTOR = gql`
  mutation ReassignWorkshopInstructor($workshopId: String!, $instructorId: String!) {
    reassignWorkshopInstructor(workshopId: $workshopId, instructorId: $instructorId) {
      ...WorkshopFields
    }
  }
  ${WORKSHOP_FIELDS}
`;

// ADD PARTICIPANT MUTATION
export const ADD_PARTICIPANT = gql`
  mutation AddParticipant(
    $first_name: String!
    $last_name: String!
    $email: String!
    $date_of_birth: String!
    $membership_level: String!
  ) {
    addParticipant(
      first_name: $first_name
      last_name: $last_name
      email: $email
      date_of_birth: $date_of_birth
      membership_level: $membership_level
    ) { ...ParticipantFields }
  }
  ${PARTICIPANT_FIELDS}
`;

// PATCH PARTICIPANT MUTATION
export const EDIT_PARTICIPANT = gql`
  mutation EditParticipant(
    $_id: String!
    $first_name: String
    $last_name: String
    $email: String
    $date_of_birth: String
    $membership_level: String
  ) {
    editParticipant(
      _id: $_id
      first_name: $first_name
      last_name: $last_name
      email: $email
      date_of_birth: $date_of_birth
      membership_level: $membership_level
    ) { ...ParticipantFields }
  }
  ${PARTICIPANT_FIELDS}
`;

// REMOVE PARTICIPANT MUTATION
export const REMOVE_PARTICIPANT = gql`
  mutation RemoveParticipant($_id: String!) {
    removeParticipant(_id: $_id) { 
        _id 
        first_name 
        last_name 
    }
  }
`;

// PATCH PARTICIPANT MUTATION
export const REGISTER_FOR_WORKSHOP = gql`
  mutation RegisterForWorkshop($participantId: String!, $workshopId: String!) {
    registerForWorkshop(participantId: $participantId, workshopId: $workshopId) {
      ...ParticipantFields
      registered_workshops { 
        ...WorkshopFields 
        }
    }
  }
  ${PARTICIPANT_FIELDS}
  ${WORKSHOP_FIELDS}
`;

// PATCH PARTICIPANT MUTATION
export const UNREGISTER_FROM_WORKSHOP = gql`
  mutation UnregisterFromWorkshop($participantId: String!, $workshopId: String!) {
    unregisterFromWorkshop(participantId: $participantId, workshopId: $workshopId) {
      ...ParticipantFields
      registered_workshops { 
        ...WorkshopFields 
        }
    }
  }
  ${PARTICIPANT_FIELDS}
  ${WORKSHOP_FIELDS}
`;
