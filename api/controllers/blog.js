import multer from 'multer';
import path from 'path';
import { db } from "../db.js";
import { getQuery } from "./user.js";

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage }).single('post_thumbnill');


//API add blog:
export const addBlog = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'File upload failed' });
        }

        try {
            const sql = await getQuery('ADD_POST');

            const values = [
                req.body.post_title,
                req.body.post_desc,
                req.body.post_cat,
                req.body.created_by,
                req.body.created_date,
                req.body.updated_by,
                req.body.updated_date,
                req.file ? req.file.filename : null
            ];

            db.query(sql, [values], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                return res.status(200).json({ status: true, message: 'Blog post saved successfully.' });
            });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};

//API get All blog post:
export const getBlog = async (req, res) => {
    try {
        const sql = await getQuery('GET_POST');
        db.query(sql, (err, results) => {
            if (err) {
                clearImmediate
            }
            return res.status(200).json({ status: true, results })
        })
    }
    catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//API update a post:
export const editBlog = async (req, res) => {
    try{
        const sql = await getQuery('UPDATE_POST');

        const values = [
            req.body.post_title,
            req.body.post_desc,
            req.body.post_cat,
            req.body.created_by,
            req.body.created_date,
            req.body.updated_by,
            req.body.updated_date,
            req.body.post_id
        ];

        db.query(sql, values, (err, results) => {
            if(err){
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(200).json({status:true, message:"Post updated successfully."})
        })
    }
    catch(err){
        console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//API delete post:
export const deletePost = async (req, res) => {
    try{
        const sql = await getQuery('DELETE_POST');

        const values = [
            req.body.post_id
        ]

        db.query(sql, [values], (err, results) => {
            if(err){
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(200).json({status:true, message:"Post deleted successfully."})
        })
    }
    catch(err){

    }
}