import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';
import { checkString, checkUsername, checkPassword } from "../helpers/validators.js";
import { err } from '../helpers/errors.js';

export async function signUp(name, username, password) { // POST (basically createUser)
    if (name === undefined) throw 'Must supply a name';
    if (username === undefined) throw 'Must supply a username';
    if (password === undefined) throw 'Must supply a password';

    name = checkString(name);
    username = checkUsername(username);
    password = checkPassword(password);

    const userCol = await users();
    const existingUser = await userCol.findOne({ username: username });
    if (existingUser) throw `User with username ${username} already exists`;

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = {
        _id: new ObjectId(),
        name: name,
        username: username,
        password: hashedPwd
    }

    const result = await userCol.insertOne(newUser);

    if (!result.acknowledged) throw 'Failed to create user';

    const created = await userCol.findOne({ _id: result.insertedId });
    delete created.password;
    return created;
} 

export async function loginUser(username, password) { // POST
    if (username === undefined) throw 'Must supply a username';
    if (password === undefined) throw 'Must supply a password';

    username = checkUsername(username);
    password = checkPassword(password);

    const userCol = await users();
    const userLoggedIn = await userCol.findOne({ username: username });
    if (!userLoggedIn) throw err(404, `User with username ${username} not found`);

    const match = await bcrypt.compare(password, userLoggedIn.password);
    if (!match) throw 'Icorrect password';

    delete userLoggedIn.password;
    return userLoggedIn;
}
