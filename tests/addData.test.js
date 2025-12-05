import test from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import { server } from '../apidefs.js'

test('searchUser tests', async (t) => {
    await server.start()

    
    const { token } = JSON.parse(fs.readFileSync('./tests/token.json', 'utf-8'))
    const decodedToken = jwt.verify(token, "my_secret_key")

    await test('addData creates a new user when ID does not exist', async () => {

        const mutation = `
            mutation {
                addData(id: 99, forename: "Add", surname: "Data") {
                    id
                    forename
                    surname
                }
            }
        `

        const response = await server.executeOperation(
            { query: mutation },
            { contextValue: { user: decodedToken.username } }
        )

        const result = response.body.singleResult.data.addData

        assert.ok(result)
        assert.equal(result.id, 99)
        assert.equal(result.forename, "Add")
        assert.equal(result.surname, "Data")
    })

    await test('addData returns error when ID already exists', async () => {

        const mutation = `
            mutation {
                addData(id: 1, forename: "Add", surname: "Data") {
                    id
                }
            }
        `
        const response = await server.executeOperation(
            { query: mutation },
            { contextValue: { user: decodedToken.username } }
        )

        const errors = response.body.singleResult.errors
        assert.ok(errors.length > 0)
        assert.equal(errors[0].error, "Record already exist")
    })

    await server.stop()
})
    