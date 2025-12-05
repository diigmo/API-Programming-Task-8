import test from 'node:test'
import assert from 'node:assert'
import { server } from '../apidefs.js'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'

test('searchUser tests', async (t) => {
    await server.start()

    await test('searchUser returns users matching searchString(search by forename)', async () => {

        const { token } = JSON.parse(fs.readFileSync('./tests/token.json', 'utf-8'))
        const decodedToken = jwt.verify(token, "my_secret_key")

        const searchQuery = `
            query {
                searchUser(searchString: "Roy") {
                    forename
                    surname
                }
            }
        `

        const response = await server.executeOperation(
            { query: searchQuery },
            { contextValue: { user: decodedToken.username } }
        )

        const data = response.body.singleResult.data.searchUser

        assert.ok(Array.isArray(data))
        assert.ok(data.length > 0)
        assert.equal(data[0].forename, "Roy")
        assert.equal(data[0].surname, "Fielding")

    })

    await test('searchUser returns users matching searchString(search by surname)', async () => {

        const { token } = JSON.parse(fs.readFileSync('./tests/token.json', 'utf-8'))
        const decodedToken = jwt.verify(token, "my_secret_key")

        const searchQuery = `
            query {
                searchUser(searchString: "Berners-Lee") {
                    forename
                    surname
                }
            }
        `

        const response = await server.executeOperation(
            { query: searchQuery },
            { contextValue: { user: decodedToken.username } }
        )

        const data = response.body.singleResult.data.searchUser

        assert.ok(Array.isArray(data))
        assert.ok(data.length > 0)
        assert.equal(data[0].forename, "Tim")
        assert.equal(data[0].surname, "Berners-Lee")

    })

    await test('searchUser returns empty array for non-existing searchString', async () => {

        const { token } = JSON.parse(fs.readFileSync('./tests/token.json', 'utf-8'))
        const decodedToken = jwt.verify(token, "my_secret_key")

        const searchQuery = `
            query {
                searchUser(searchString: "NonExistentName") {
                    forename
                    surname
                }
            }
        `

        const response = await server.executeOperation(
            { query: searchQuery },
            { contextValue: { user: decodedToken.username } }
        )

        const data = response.body.singleResult.data.searchUser

        assert.ok(Array.isArray(data))
        assert.equal(data.length, 0)
    })

    await server.stop()
})

