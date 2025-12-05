import test from 'node:test'
import assert from 'node:assert'
import { server } from '../apidefs.js'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'

test('updateData tests', async (t) => {
    await server.start()

    const { token } = JSON.parse(fs.readFileSync('./tests/token.json', 'utf-8'))
    const decodedToken = jwt.verify(token, "my_secret_key")


    await test('updateData updates existing user', async () => {

        const idToUpdate = "4"

        const updateMutation = `
            mutation {
                updateData(id: ${idToUpdate}, forename: "NewUser", surname: "NewData") {
                    success
                    message
                    updated {
                        id
                        forename
                        surname
                    }
                }
            }
        `
        const updateResp = await server.executeOperation(
            { query: updateMutation },
            { contextValue: { user: decodedToken.username } }
        )

        const result = updateResp.body.singleResult.data.updateData

        assert.equal(result.success, true)
        assert.equal(result.message, "User updated")
        assert.ok(result.updated)
        assert.equal(Number(result.updated.id), Number(idToUpdate))
        assert.equal(result.updated.forename, "NewUser")
        assert.equal(result.updated.surname, "NewData")
    })

    await test('updateData updates a non-existent user (i.e. creates a new one)', async () => {

        const idToUpdate = "99"

        const updateMutation = `
            mutation {
                updateData(id: ${idToUpdate}, forename: "NewUser", surname: "NewData") {
                    success
                    message
                    updated {
                        id
                        forename
                        surname
                    }
                }
            }
        `
        const updateResp = await server.executeOperation(
            { query: updateMutation },
            { contextValue: { user: decodedToken.username } }
        )

        const result = updateResp.body.singleResult.data.updateData

        assert.equal(result.success, true)
        assert.equal(result.message, "User created")
        assert.ok(result.updated)
        assert.equal(Number(result.updated.id), Number(idToUpdate))
        assert.equal(result.updated.forename, "NewUser")
        assert.equal(result.updated.surname, "NewData")
    })

    await server.stop()
})