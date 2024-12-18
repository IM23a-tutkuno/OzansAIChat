import Anthropic from "@anthropic-ai/sdk";

let ANTHROPIC_API_KEY='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'


const anthropic = new Anthropic({apiKey: ANTHROPIC_API_KEY});

const msg = await anthropic.messages.create({
model: "claude-3-5-sonnet-20241022",
max_tokens: 1000,
temperature: 0,
system: "Respond only with short poems.",
messages: [
    {
    "role": "user",
    "content": [
        {
        "type": "text",
        "text": "Why is the ocean salty?"
        }
    ]
    }
]
});
console.log(msg);

