import test from 'node:test'
import assert from 'node:assert'
import jwt from 'jsonwebtoken'

import {verifyToken} from '../middleware/verifytoken.js'

// user "pl" exits in authdb.js
test('returns username when token is valid and user exists', () => {
    const token = jwt.sign({username: 'pl'}, 'my_secret_key')
    const authHeader = `Bearer ${token}`

    const result = verifyToken(authHeader)

    assert.strictEqual(result, 'pl')
})

// user does not exits in authdb.js
test('return null when user does not exists', () => {
    const token = jwt.sign({username: 'unknown'}, 'my_secret_key')
    const authHeader = `Bearer ${token}`

    const result = verifyToken(authHeader)

    assert.strictEqual(result, null)
})

// invalid signature
test('returns null for invalid signature', () => {
    const token = jwt.sign({username: 'pl'}, 'wrong_secret_key')
    const authHeader = `Bearer ${token}`

    const result = verifyToken(authHeader)

    assert.strictEqual(result, null)
})

// expired token
test('return null for expired token', () => {
    const token = jwt.sign(
        {username: 'pl'},
        'my_secret_key',
        {expiresIn: -1}
    )
    const authHeader = `Bearer ${token}`

    const result = verifyToken(authHeader)

    assert.strictEqual(result, null)
})