export const typeDefs = `
    """
    Authentication payload returned after a successful login.
    Contains the JWT token and related metadata.
    """
    type AuthPayload {
        "The access token generated for the user."
        access_token: String!
        "The username associated with the session."
        username: String!
        "The type of token (typically 'Bearer')."
        token_type: String!
        "Duration until the token expires."
        expires_in: String!
    }

    """
    Represents a system user.
    """
    type User {
        "Unique username of the user."
        username: String!
        "Data records owned by the user."
        userOwnData: [Data!]!
    }

    """
    Represents a single data record stored in the system.
    """
    type Data {
        "ID  of the record."
        id: ID!
        "User's forename"
        forename: String!
        "User's surname"
        surname: String!
    }

    """
    Represents a data record returned for search results.
    """
    type SearchData {
        "Matching first name(or forename, if matching was surname)"
        forename: String!
        "Matching surname(or surname, if matching was surname)"
        surname: String!
    }

    """
    Response returned after deleting user.
    """
    type DeleteResponse {
        "Indicates whether the operation was successful."
        success: Boolean!
        "Additional details about the result."
        message: String!
        "The removed record, if applicable."
        removed: Data
    }

    """
    Response returned after updating a database.
    """
    type UpdateResponse {
        "Indicates whether the operation was successful."
        success: Boolean!
        "Additional details about the update."
        message: String!
        "The record after the update."
        updated: Data
    }
        
    """
    Obtaining information from a database 
    (obtaining all data, users with a specific ID, searching for users by string(string can be surname or forename))
    """
    type Query {
        """
        Retrieve all data records from the database.
        """
        getAllData: [Data!]!
        
        """
        Retrieve a data record by ID.
        """
        getDataById(id: ID!): Data!

        """
        Retrieve all data entries owned by the specified user.
        """
        getUserData(username: String!): [Data!]

        """
        Search for users by surname or forename.
        """
        searchUser(searchString: String!): [SearchData!]
    }

    """
    Changing data in the database (adding a user, changing user data, deleting a user)
    """
    type Mutation {
        """
        Add a new user to the database.
        """
        addData(
            id: ID!
            forename: String!
            surname: String!
        ): Data

        """
        Delete user by its ID.
        """
        deleteData(id: ID!): DeleteResponse

        """
        Update the fields of an existing user.
        """
        updateData( 
            id: ID!
            forename: String!
            surname: String!
        ): UpdateResponse

        """
        Authenticate user and return a JWT token payload.
        """
        login(username: String!, password: String!): AuthPayload
    }
`