import {server} from './apidefs.js'
import { startStandaloneServer} from '@apollo/server/standalone'
import {verifyToken} from './middleware/verifytoken.js'
import {rateLimiter} from './middleware/ratelimiter.js'
import { __Schema } from 'graphql'

const { url } = await startStandaloneServer(server, {
    context: ({req}) => {
        const token = req.headers.authorization || ''
        const authUser = verifyToken(token)

        const isIntrospection = 
            req.body?.operationName === "IntrospectionQuery" ||
            req.body?.query?.includes("__schema") ||
            req.body?.query?.includes("__type")
        if(!isIntrospection && authUser)
            rateLimiter(authUser)
        return {user: authUser}
    },
    listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)