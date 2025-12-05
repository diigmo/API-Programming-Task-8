import test from 'node:test'
import assert from 'node:assert'
import {server} from '../apidefs.js'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'

test('getAllData returns all data for authorized user', async () => {
    await server.start()

    // Read the token from the file created during login test
    const { token } = JSON.parse(fs.readFileSync('./tests/token.json', 'utf-8'))
    const decodedToken = jwt.verify(token, "my_secret_key")

    const query = `
        query {
            getAllData {
                id
                forename
                surname
            }
        }
    `
    const response = await server.executeOperation(
        {query},
        {contextValue: { user: decodedToken.username }
    })
    await server.stop()
    const data = response.body.singleResult.data.getAllData
    assert.ok(Array.isArray(data))
    assert.ok(data.length > 0)
})
