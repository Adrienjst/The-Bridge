import { useState, useCallback } from 'react';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function fetchStreamingResponse(
    messages: ChatMessage[],
    locale: string,
    mode: string,
    onToken?: (token: string) => void,
    apiPath: string = '/api/chat'
): Promise<string> {
    const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, locale, mode }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to get response');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    if (reader) {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6).trim();
                    if (dataStr === '[DONE]' || dataStr === '[ERROR]') continue;
                    
                    let tokenToAppend = '';
                    try {
                        const parsed = JSON.parse(dataStr);
                        tokenToAppend = parsed.token || parsed.content || '';
                    } catch {
                        // Plain text chunk fallback
                        tokenToAppend = dataStr.replace(/\\n/g, '\n');
                    }

                    if (tokenToAppend) {
                        fullContent += tokenToAppend;
                        if (onToken) onToken(tokenToAppend);
                    }
                }
            }
        }
    }
    return fullContent;
}

export function useStreamingChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (
        content: string | null, 
        locale: string, 
        mode: string, 
        history: ChatMessage[] = messages,
        apiPath: string = '/api/chat'
    ): Promise<string> => {
        let newMessages = [...history];
        
        if (content !== null) {
            newMessages = [...history, { role: 'user', content }];
            setMessages(newMessages);
        }
        
        setIsStreaming(true);
        setError(null);

        try {
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
            
            const fullContent = await fetchStreamingResponse(
                newMessages,
                locale,
                mode,
                (token) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        const lastMsg = updated[updated.length - 1];
                        lastMsg.content += token;
                        return updated;
                    });
                },
                apiPath
            );
            return fullContent;
        } catch (err: unknown) {
            const errMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errMessage);
            throw err;
        } finally {
            setIsStreaming(false);
        }
    }, [messages]);

    const resetChat = useCallback(() => {
        setMessages([]);
        setError(null);
        setIsStreaming(false);
    }, []);

    return { messages, setMessages, isStreaming, error, setError, sendMessage, resetChat };
}
