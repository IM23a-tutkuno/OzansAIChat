import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from "axios";
import jwt from 'jsonwebtoken'

dotenv.config();  // Load .env file for environment variables

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)
// MySQL connection using environment variables
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Endpoint to fetch API key from database
app.get('/api/get-api-key', (req, res) => {
    db.query('SELECT api_key.api_key, ai_platform.ai_name, users.vorname, users.nachname  FROM ai_platform INNER JOIN api_key ON api_key.ai_platform_id = ai_platform.ai_platform_id INNER JOIN Users ON api_key.user_id = users.user_id;', (err, results) => {
        if (err) {
            console.error('Error fetching API key:', err);
            return res.status(500).json({error: 'Failed to fetch API key'});
        }
        if (results.length > 0) {
            console.log(results[0]);
            res.json({
                apikey: results[0].api_key,
                ai_name: results[0].ai_name,
                vorname: results[0].vorname,
                nachname: results[0].nachname
            });
        } else {
            res.status(404).json({error: 'API Key not found'});
        }
    });
});

async function check_credentials(username, password) {
    return new Promise((resolve, reject) => {
        const query = `CALL check_credentials("${username}", "${password}");`
        db.query(query, [username, password], (err, results) => {
            if (err) {
                console.error('Error during credentials check:', err);
                reject(err); // Reject the promise if there's an error
            }
            let result = results[0][0].value_exists
            console.log(result)
            resolve(result)
        });
    });
}


async function get_user(username, password) {
    console.log('sfa')
    return new Promise((resolve, reject) => {
        const query = `CALL get_user("${username}", "${password}");`
        db.query(query, [username, password], (err, results) => {
                if (err) {
                    console.error('Ran into error getting user information.')
                    reject(err)
                }
                resolve(results)
            }
        )
    })
}

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(`Username ${username}`)
    console.log(`Password ${password}`)
    let result = await check_credentials(username, password)
    if (result === 1) {
        let info = await get_user(username, password)
        info = info[0][0]
        const token = jwt.sign(
            {
                username: info.username,
                passwort: info.passwort,
                api_key: info.api_key,
                ai_name: info.ai_name
            },
            process.env.SECRET_JWT
        )
        console.log(res.json)
        res.json({success: true, message: "Logged in successfully!", result, token})
    } else if (result === 0) {
        res.json({success: false, message: "Username or password wrong!", result});
    }
});


