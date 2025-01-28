import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import pg from 'pg'
import axios from "axios";
import jwt from 'jsonwebtoken'
import {createClient} from '@supabase/supabase-js'
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai"


const app = express();
const PORT = 5000;
const {Client} = pg
dotenv.config();  // Load .env file for environment variables


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


app.use(cors());
app.use(express.json());


async function check_credentials(username_input, passwort_input) {
    try {
        let datas = {"username_input": username_input, "passwort_input": passwort_input}
        const {data, error} = await supabase
            .rpc('check_credentials', datas);

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
    const {username_input, passwort_input} = req.body;
    console.log(req.body)
    console.log(`Username ${username_input}`)
    console.log(`Password ${passwort_input}`)
    console.log('safffs')
    let result = await check_credentials(username_input, passwort_input)
    console.log(result)
    if (result === true) {
        let info = await get_user(username_input, passwort_input)
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
    const token = req.body.token
    const user_messages = req.body.messages
    console.log(user_messages)
    console.log("safsajf")
    const decoded_token = jwt.decode(token)
    console.log(decoded_token)
    const API_KEY = decoded_token.apiKey
    const ai_name = req.body.ai_name
    console.log(ai_name)
    if (ai_name === "Claude") {
        const anthropic = new Anthropic({
            apiKey: API_KEY // defaults to process.env["ANTHROPIC_API_KEY"]
        });
        const response = await send_chat(user_messages, anthropic)
        res.json({success: true, response: response, token})
    } else if (ai_name === "deepseek-r1") {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_KEY,
            defaultHeaders: {
            }

        })
        const response = await send_openrouter_chat(user_messages, openai)
        console.log(response)
        res.json({success: true, response: response, token})

    }


});


async function send_chat(user_messages, anthropic) {
    console.log("ffsafff")
    console.log(user_messages)
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: user_messages
    });
    return msg.content[0].text
}

async function send_openrouter_chat(prompt, openai) {
    console.log(prompt)
    const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1",
        messages: prompt
    })
    console.log(completion.choices[0].message.content)
    return completion.choices[0].message.content
}


