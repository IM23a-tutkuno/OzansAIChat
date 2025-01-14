import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import pg from 'pg'
import axios from "axios";
import jwt from 'jsonwebtoken'
import {createClient} from '@supabase/supabase-js'
import Anthropic from "@anthropic-ai/sdk";


const app = express();
const PORT = 5000;
const {Client} = pg
dotenv.config();  // Load .env file for environment variables


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


app.use(cors());
app.use(express.json());


async function check_credentials(username_input, passwort_input) {
    try {
        const {data, error} = await supabase
            .rpc('check_credentials', {passwort_input, username_input});

        if (error) {
            console.error('Error checking credentials:', error);
            throw error;
        }

        return data; // Should return true or false from your Supabase function
    } catch (err) {
        console.error('Error while checking credentials.', err);
        throw err;
    }
}

let wow = await check_credentials('meow', 'TestUser')
console.log(wow)


async function get_user(username_input, passwort_input) {
    try {
        const {data, error} = await supabase
            .rpc('get_user', {passwort_input, username_input});

        if (error) {
            console.error('Error fetching user information:', error);
            throw error;
        }
        console.log(data)
        return data; // Should return the user's details from your Supabase function
    } catch (err) {
        console.error('Error while fetching user information:', err);
        throw err;
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
        info = info[0]
        const apiKey = info.api_key
        const token = jwt.sign(
            {
                username: info.username,
                passwort: info.passwort,
                apiKey: apiKey,
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
    const API_KEY = decoded_token.apiKey
    console.log(decoded_token)
    console.log(API_KEY)
    const anthropic = new Anthropic({
        apiKey: API_KEY // defaults to process.env["ANTHROPIC_API_KEY"]
    });
    const response = await send_chat(user_prompt, anthropic)
    console.log(response)
    res.json({success: true, response: response, token})


});


async function send_chat(prompt, anthropic) {
    console.log(prompt)
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: prompt
    });
    console.log(msg)
    return msg.content[0].text
}


