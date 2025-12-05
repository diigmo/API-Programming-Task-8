import test from 'node:test'
import assert from 'node:assert'
import { server } from '../apidefs.js'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'

test('deleteData tests', async (t) => {
    await server.start()

    const { token } = JSON.parse(fs.readFileSync('./tests/token.json', 'utf-8'))
    const decodedToken = jwt.verify(token, "my_secret_key")

    await test('deleteData deletes user and returns removed user', async () => {

        const id = "4";
        
        const mutation = `
            mutation {
                deleteData(id: ${id}) {
                    success
                    message
                    removed {
                        id
                        forename
                        surname
                    }
                }
            }
        `;

        const deleteResp = await server.executeOperation(
            { query: mutation },
            { contextValue: { user: decodedToken.username } }
        );

        //await server.stop()

        const result = deleteResp.body.singleResult.data.deleteData;

        assert.equal(result.success, true)
        assert.equal(result.message, "User deleted")
        assert.ok(result.removed)
        assert.equal(Number(result.removed.id), Number(id))
        assert.equal(result.removed.forename, "Test")
        assert.equal(result.removed.surname, "Data")
    });


    await test('Checking if an ID does not exist in the database', async () => {

        const id = "-1";
        
        const mutation = `
            mutation {
                deleteData(id: ${id}) {
                    success
                    message
                    removed {
                        id
                        forename
                        surname
                    }
                }
            }
        `;

        const deleteResp = await server.executeOperation(
            { query: mutation },
            { contextValue: { user: decodedToken.username } }
        );

        const errors = deleteResp.body.singleResult.errors
        assert.ok(errors.length > 0, 'Error should exist')

        assert.equal(errors[0].error, 'ID error')

    });

    await server.stop()
})

