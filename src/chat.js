const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

async function chat(req, res) {
    const prompt = [
        {
            role:"user",
            content:`You will analyze the user's investment preferences based on the provided content. The investment preferences are only output three types: aggressive, moderate and conservative. Then, recommend three Web3 Protocols suitable for investment according to the analyzed investment preferences.
The content you need to analyze is as follows:
<user_content>
{{USER_CONTENT}}
</user_content>
The definitions of investment preferences are as follows:
Conservative type: Tends to invest in low - risk options, prefers stable and safe investment choices, and has a low tolerance for risk.
Stable type: Can tolerate a certain amount of risk, pursues a balance between risk and return, and makes investment decisions with caution.
Aggressive type: Has a high tolerance for risk, pursues high returns, and is willing to take on greater risks to obtain high - level rewards.
The method of analyzing investment preferences: Carefully read the user's content and look for expressions related to risk preference. For example, emphasizing stable returns (possibly a conservative type), expressions of balancing risk and return (possibly a stable type), or a tendency towards high - return gambles (possibly an aggressive type).
Rules for recommending Protocols according to different investment preferences:
For the conservative type, recommend Web3 Protocols with mature technology, a stable user base, and low - risk characteristics.
For the stable type, recommend Web3 Protocols with moderate risk, certain innovation potential, and market recognition.
For the aggressive type, recommend emerging Web3 Protocols with high - growth potential but potentially high risks.
Please analyze according to the above content. Directly output the investment preferences, and then list three suitable Web3 Protocols below.
`
        },
    ]
    try {
        console.log("req.body:", req.body);
        const { messages } = req.body;
        console.log("messages:", messages);
        //将prompt放入messages的第一个位置
        messages.unshift(...prompt);
        console.log("Open AI API request:", messages);
        const requestData = {
            model: "o1-mini",
            messages,
            stream: false
        };
        const response = await axios.post('https://api.openai.com/v1/chat/completions', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
        });
        console.log("Open AI API response:", response.data);

        res.json(response.data);
    } catch (error) {
        console.error("Open AI API err:", error);
        res.status(500).send('Open AI API failed.');
    }
}



module.exports.chat = chat;