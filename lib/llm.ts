import { ChatOpenAI } from "@langchain/openai";
import { config as dotenvConfig } from "dotenv";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";

// Load environment variables dari file .env
dotenvConfig();
const llm_key = process.env.MODELSTUDIO_API_KEY;

const llm = new ChatOpenAI({
    model: "qwen-turbo",
    apiKey: llm_key,
    temperature: 0.7,
    configuration: {
        baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    },
    streaming: true
});



// Map untuk menyimpan riwayat pesan berdasarkan thread ID
const threadMessages = new Map<string, (HumanMessage | AIMessage)[]>();
// Add streaming function for frontend
export async function* streamChat(messages: { role: string, content: string }[], threadId: string) {
    if (!threadMessages.has(threadId)) {
        threadMessages.set(threadId, []);
    }
    const history = threadMessages.get(threadId)!;
    const last = messages[messages.length - 1];
    history.push(new HumanMessage({ content: last.content }));
    const config = { configurable: { thread_id: threadId } };
    const stream = await llm.stream(history, config);
    let responseContent = "";
    for await (const chunk of stream) {
        const content = typeof chunk.content === 'string' ? chunk.content : JSON.stringify(chunk.content);
        responseContent += content;
        yield content;
    }
    history.push(new AIMessage({ content: responseContent }));
    threadMessages.set(threadId, history);
}

export default llm;