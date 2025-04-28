import { NextRequest } from 'next/server';
import { streamChat } from '@/lib/llm';

// API route untuk menangani streaming chat
export async function POST(request: NextRequest) {
  const { messages, threadId } = await request.json();
  const encoder = new TextEncoder();
  const stream = streamChat(messages, threadId);
  // memastikan bahwa streamChat mengembalikan ReadableStream
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      }
    }),
    {
      headers: { 'Content-Type': 'text/plain' }
    }
  );
}
