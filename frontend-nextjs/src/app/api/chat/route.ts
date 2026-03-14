import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientId } from '@/utils/rateLimit';

// Local Python Orchestrator URL (should be in .env.local for prod)
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:8003/stream';
const ORCHESTRATOR_SECRET = process.env.ORCHESTRATOR_SECRET || 'dev_secret_key_123';

export async function POST(req: NextRequest) {
    try {
        const { messages, userId = "anonymous", weakModules = [] } = await req.json();

        // Pass down to the new Python LangGraph Orchestrator
        const response = await fetch(ORCHESTRATOR_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ORCHESTRATOR_SECRET}`,
            },
            body: JSON.stringify({
                user_id: userId,
                messages: messages,
                weak_modules: weakModules
            }),
        });

        if (!response.ok) {
            console.error('Orchestrator error:', response.status, await response.text());
            return NextResponse.json(
                { error: 'AI Orchestrator is temporarily unavailable.' },
                { status: response.status }
            );
        }

        // DO NOT collect. DO NOT buffer. Just pipe the stream directly to the client.
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });


    } catch (error) {
        console.error('Chat API proxy error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred while contacting the Orchestrator.' },
            { status: 500 }
        );
    }
}
