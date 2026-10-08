const { z } = require('zod');

const authValidator = z.object({
    username: z.string()
        .min(1, { message: 'Username is too short.' })
        .max(20, { message: 'Username is too long.' }),

    password: z.string()
        .min(6, { message: 'Password is contain minimum 6 characters.' })
        .max(10, { message: 'Password is too long.' })
});
module.exports = { authValidator };