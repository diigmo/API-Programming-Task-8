import test from 'node:test'
import assert from 'node:assert'
import {server} from '../apidefs.js'

test("getDataById return the correct data for a given ID", async () => {
    await server.start()

    const query = `
        query ($id: ID!) {
            getDataById(id: $id) {
                id
                forename
                surname
            }
        }
    `
    const response = await server.executeOperation({
        query,
        variables: { id: "1" }
    })

    await server.stop()
    assert.ok(response.body.singleResult.data)
    assert.equal(response.body.singleResult.data.getDataById.id, '1')
})