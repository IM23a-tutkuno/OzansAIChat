import Anthropic from "@anthropic-ai/sdk";

const API_KEY = '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';


const anthropic = new Anthropic({
    apiKey: API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
    dangerouslyAllowBrowser: true
});

async function send_chat(prompt) {
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

export {send_chat}
