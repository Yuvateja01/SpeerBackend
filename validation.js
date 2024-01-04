const zod = require("zod");


const createUser = zod.object({
        username:zod.string().min(6),
        password:zod.string().min(8)
});

const createNote = zod.object({
    title:zod.string(),
    description:zod.string()
})

module.exports = {
    createUser,
    createNote
}