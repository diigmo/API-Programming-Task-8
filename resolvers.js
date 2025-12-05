import {getUsers, getUserById, createUser, getUserDataMap, deleteUserById, updateUser, searchUser } from './databases/db.js'
import {getAuthUser} from './databases/authdb.js'
import jwt from 'jsonwebtoken'

export const resolvers = {
    Query: {
        getAllData: (parent, args, context) => {
            if (!context.user)
                throw new Error('Unauthorized access')
            return getUsers()
        },

        getDataById: (parent, args) => getUserById(Number(args.id)),

        getUserData: (parent, args) => {
            const userId = getUserDataMap(args.username)
            if(!userId) return []
            const data = getUsers()
            return data.filter(person => userId.includes(person.id))
        },

        searchUser: (parent, args) => {
            const searchString = args.searchString
            const searchResult = searchUser(searchString)
            return searchResult;
        }

    },

    User: {
        userOwnData: (parent) => {
            const userId = getUserDataMap(parent.username)
            if(!userId) return []    
            const data = getUsers()
            return data.filter(person => userId.includes(person.id)) 
        }
    },


    Mutation: {
        addData: (parent, args) => {
            const id = Number(args.id)
            if( getUserById(id) )
                throw new Error('Record already exist')
            else {
                const newUser = createUser({...args, id})
                return newUser
            }
        },

        deleteData: (parent, args) => {
            const id = Number(args.id)
            const user = getUserById(id);
            if( !getUserById(id) )
                throw new Error('ID error')
            else {
                deleteUserById(id)
                return {
                    success: true,
                    message: "User deleted",
                    removed: user
                }
            }
        },

        updateData: (parent, args) => {
            const id = Number(args.id)
            const exist = getUserById(id);
            const newData = { ...args };
            delete newData.id;
            updateUser(id, newData)
            const user = getUserById(id);

            if(exist)
            {
                return {
                    success: true,
                    message: "User updated",
                    updated: user
                }
            }
            else
                {
                    return {
                        success: true,
                        message: "User created",
                        updated: user
                }
            }

        },
        
        login: (parent, {username, password}) => {
            const user = getAuthUser(username)
            if( user && (user.password === password)) {
                const token = jwt.sign({username: username}, "my_secret_key", {
                    expiresIn: '1h'
                }) 

                return {
                    "username": username,
                    "access_token": token,
                    "token_type": "Bearer",
                    "expires_in": "1h"
                }
            } else
                throw new Error('Unauthorized') 
        }
    }
}