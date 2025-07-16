import { db } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

//API to fetch query:
export const getQuery = (query_name) => {
    return new Promise((resolve, reject) => {
        const sql = 'select query from custom_query where query_name=?';
        db.query(sql, [query_name], (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
            }
            resolve(results.length > 0 ? results[0].query : null);
        });
    })
}

//API to fetch all users list:
export const getUsers = async (req, res) => {
    try {
        const sql = await getQuery('GET_USERS');

        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(results);
            return res.status(200).json(results);
        });
    }
    catch (error) {
        console.error('Error in getUsers:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

//API to add new user or Signup:
export const addUser = async (req, res) => {
    try {
        //Check existing user:
        let sql_query = 'SELECT email FROM users where email =?';
        const val = [req.body.email];
        db.query(sql_query, val, (err, data) => {
            if(err){
                console.error('Error fetching users:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if(data.length){
                return res.status(409).json({status:false, message: 'User already exists!' });
            }
        })

        // const plainPassword = req.body.password;
        // const saltRounds = 12; // Recommended: 12 or higher
        // const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        // console.log('hashedpassword======>>', hashedPassword);

        // const sql = await getQuery('ADD_USER');
        // const values = [
        //     req.body.first_name,
        //     req.body.last_name,
        //     req.body.email,
        //     req.body.phone,
        //     req.body.gender,
        //     hashedPassword
        // ];
        // db.query(sql, [values], (err, results) => {
        //     if (err) {
        //         console.error('Error fetching users:', err);
        //         return res.status(500).json({ error: 'Internal Server Error' });
        //     }
        //     console.log(results);
        //     return res.status(200).json({ status: true, message: 'User added successfully.' });
        // })
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//API to update User:
export const updateUser = async (req, res) => {
    try {
        const sql = await getQuery('UPDATE_USER');
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.phone,
            req.body.gender,
            req.body.user_id,
        ];
        db.query(sql, values, (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(results);
            return res.status(200).json({ status: true, message: 'User updated successfully.' });
        })

    }
    catch (error) {
        console.log('Error', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//API to delete user:
export const deleteUser = async (req, res) => {
    try {
        const sql = await getQuery('DELETE_USER');
        const values = [
            req.body.user_id
        ];
        db.query(sql, values, (err, results) => {
            if (err) {
                console.log('Error', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(results);
            return res.status(200).json({ status: true, message: 'User deleted successfully.' })
        })
    }
    catch (error) {
        console.log('Error', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//API to login user:
export const loginUser = async (req, res) => {
    try {
        const plainPassword = req.body.password;
        const sql = await getQuery('USER_LOGIN');

        const values = [req.body.email];

        // Using Promisified Query
        const results = await new Promise((resolve, reject) => {
            db.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length === 0) {
            console.log('User not found');
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        const hashedPassword = results[0].password;

        // Compare the input password with the stored hash
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        //console.log("isMatch", isMatch);

        if (isMatch) {
            console.log('Login successful!');
            const token = jwt.sign({ id: results[0].id }, "jwtkey");
            console.log("token", token);
            const { password, ...other } = results[0];
            console.log("other", other);
            res.cookie("access_token", token, { httpOnly: true,}).status(200).json(other);
            return res.status(200).json({ status: true, message: 'User login successfully.', token:token });
        } else {
            console.log('Invalid credentials');
            return res.status(401).json({ status: false, message: 'Invalid credentials.' });
        }
    }
    catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
