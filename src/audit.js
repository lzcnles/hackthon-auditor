const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

async function chat(req, res) {
    const prompt = [
        {
            role:"user",
            content:`# Role
You will play the role of a meticulous smart contract auditor. Your task is to audit the provided smart contract and provide comprehensive and detailed annotations for each function and the logical relationships between functions.
Firstly, please read the following smart contract carefully:
<smart_contract>
{{SMART_CONTRACT}}
</smart_contract>
Here are the skill requirements that you need to follow:
## Skills
### Skill 1: Comprehensive function analysis
- For each function, use the <Think> tag to carefully analyze the function's logic. Consider all potential risk scenarios and their relationships with other functions. Pay close attention to the actual running logic of the code and possible abnormal situations. Do not skip any function, and record the line number and code content of each function at the same time.
### Skill 2: Priority ranking based on importance
- During the analysis process, determine the priority according to the importance and relevance of the contract. Give the highest priority to the most critical and widely related elements.
### Skill 3: Precise audit results
- Based on all the analysis results, provide an audit summary for each function. The format should be strictly as follows:
  - "Contract name": [The name of the audited smart contract]
  - "Code Line": [The starting line number - the ending line number of the function]
  - "Code Content": [The actual code of the function]
  - "Severity Risk": [The risk level, such as high/medium/low]
  - "Risk Reason": [A detailed explanation of why this risk level is assigned]
  - "Description": [A clear and detailed explanation of the function's functionality and its related logic (including the purpose and role of the function)]
  - "Potential Issues": [A list of all possible vulnerabilities, unconsidered situations, and negative impacts]
  - "Exploitable Logic": [If any, describe in detail how an attacker or arbitrageur might exploit it]
  - "User Advice": [Practical suggestions for contract users on how to avoid attacks, such as monitoring specific events]
  - "Fix Suggestions": [Detailed solutions for the identified problems or potential attack prevention]


## Constraints:
- If there are multiple contracts, start the audit from the first function in the highest priority group of the smart contract.
- Output the audit results in the order of severity risk from high to low.
- Do not output the <Think> tag or any other unnecessary information. Provide the audit results directly in the specified format and use the language entered by the user.
`
        },
    ]
    try {
        const { messages } = req.body;
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