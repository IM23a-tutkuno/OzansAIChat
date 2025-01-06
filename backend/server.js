import express, {json} from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import pg from 'pg'
import axios from "axios";
import jwt from 'jsonwebtoken'
import Anthropic from "@anthropic-ai/sdk";


const app = express();
const PORT = 5000;
const {Client} = pg
dotenv.config();  // Load .env file for environment variables


const client = new Client({
    connectionString: "postgresql://postgres:WompWomp12345@localhost:5432/OzanAI_Chat"
});

await client.connect()


app.use(cors());
app.use(express.json());



async function check_credentials(username, password) {
    let query = `SELECT * FROM check_credentials($1, $2);`;
    try {
        let results = await client.query(query, [username, password])
        let result = results.rows[0].check_credentials
        return result
    } catch (err) {
        console.error('Error while checking credentials.', err)
        throw err;
    }

}

let wow = await check_credentials('meow', 'TestUser')
console.log(wow)


async function get_user(username, password) {
    console.log('sfa')
    let query = `SELECT * FROM get_user($1, $2);`;
    try {
        // Query the database
        let user_results = await client.query(query, [username, password]);
        return user_results;
    } catch (err) {
        console.error('Error while fetching user information:', err);
        throw err; // Pass the error to the caller
    }

}

let yes = await get_user('KajaBear<3', 'ILOVEKAJAKULTERMAN')
console.log(yes)


app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(`Username ${username}`)
    console.log(`Password ${password}`)
    console.log('safffs')
    let result = await check_credentials(username, password)
    console.log(result)
    if (result === true) {
        let info = await get_user(username, password)
        info = info.rows[0]
        console.log(info)
        const apiKey = info.api_key
        const token = jwt.sign(
            {
                username: info.username,
                passwort: info.passwort,
                ai_name: info.ai_name
            },
            process.env.SECRET_JWT
        )
        console.log(res.json)
        console.log(token)
        res.json({success: true, message: "Logged in successfully!", result, token, apiKey})
    } else if (result === false) {
        res.json({success: false, message: "Username or password wrong!", result});
    }
});


app.post('/api/chat', async (req, res) => {
    console.log(req.body)
    const token = req.body.Authorization
    const user_prompt = req.body.prompt
    const decoded_token = jwt.decode(token)
    const API_KEY = decoded_token.api_key
    console.log(decoded_token)
    const anthropic = new Anthropic({
        apiKey: API_KEY // defaults to process.env["ANTHROPIC_API_KEY"]
    });
    const response = await send_chat(user_prompt, anthropic)
    res.json({success: true, response: response, token})


});


async function send_chat(prompt, anthropic) {
    console.log(prompt)
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt
                    }
                ]
            }
        ]
    });
    console.log(msg)
    return msg.content[0].text
}


