// 

export const typeDefs = `#graphql
    type Instructor {
        _id: String
        first_name: String
        last_name: String
        specialty: String
        studio_name: String
        email: String
        phone: String
        date_joined: String
        workshops: [Workshop]
        numOfWorkshops: Int
    }

    type Workshop {
        _id: String
        title: String
        category: String
        location: String
        duration_hours: Int
        instructor: Instructor
        workshop_start: String
        workshop_end: String
        registration_open: String
        registration_close: String
        registeredParticipants: [Participant]
        numOfRegisteredParticipants: Int
    }

    type Participant {
        _id: String
        first_name: String
        last_name: String
        email: String
        date_of_birth: String
        membership_level: String
        registered_workshops: [Workshop]
        numOfRegisteredWorkshops: Int
    }

    type Query {
        instructors: [Instructor]
        workshops: [Workshop]
        participants: [Participant]

        getInstructorById(_id: String!): Instructor
        getWorkshopById(_id: String!): Workshop
        getParticipantById(_id: String!): Participant

        getWorkshopsByInstructorId(instructorId: String!): [Workshop]

        getParticipantsByWorkshopId(workshopId: String!): [Participant]

        getWorkshopsByCategory(category: String!): [Workshop]

        getInstructorsByStudio(studio: String!): [Instructor]

        getParticipantsByMembership(level: String!): [Participant]

        getInstructorsJoinedBetween(start: String!, end: String!): [Instructor]

        getWorkshopsByRegistrationRange(start: String!, end: String!): [Workshop]

        searchParticipantsByLastName(searchTerm: String!): [Participant]
    }

    type Mutation {
        addInstructor(
            first_name: String!,
            last_name: String!,
            specialty: String!,
            studio_name: String!,
            email: String!,
            phone: String!,
            date_joined: String!
        ): Instructor

        editInstructor(
            _id: String!,
            first_name: String,
            last_name: String,
            specialty: String,
            studio_name: String,
            email: String,
            phone: String,
            date_joined: String
        ): Instructor

        removeInstructor(_id: String!): Instructor


        addParticipant(
            first_name: String!,
            last_name: String!,
            email: String!,
            date_of_birth: String!,
            membership_level: String!
        ): Participant

        editParticipant(
            _id: String!,
            first_name: String,
            last_name: String,
            email: String,
            date_of_birth: String,
            membership_level: String
        ): Participant

        removeParticipant(_id: String!): Participant

        
        addWorkshop(
            title: String!,
            category: String!,
            location: String!,
            duration_hours: Int!,
            instructor: String!,
            workshop_start: String!,
            workshop_end: String!,
            registration_open: String!,
            registration_close: String!
        ): Workshop

        editWorkshop(
            _id: String!,
            title: String,
            category: String,
            location: String,
            duration_hours: Int,
            instructor: String,
            workshop_start: String,
            workshop_end: String,
            registration_open: String,
            registration_close: String
        ): Workshop

        removeWorkshop(_id: String!): Workshop


        reassignWorkshopInstructor(
            workshopId: String!,
            instructorId: String!
        ): Workshop

        registerForWorkshop(
            participantId: String!,
            workshopId: String!
        ): Participant

        unregisterFromWorkshop(
            participantId: String!,
            workshopId: String!
        ): Participant
    }
`;