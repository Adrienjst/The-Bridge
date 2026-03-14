import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export async function POST(req: NextRequest) {
    try {
        const { text, locale = 'fr', rate = '-5%', pitch = '+0Hz' } = await req.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Missing text' }, { status: 400 });
        }

        // Clean text: strip LaTeX, markdown
        const cleanText = text
            .replace(/\$[^$]+\$/g, 'formule')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/#{1,6}\s/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\n\n/g, '. ')
            .replace(/\n/g, ', ');

        // Choose natural-sounding neural voice
        const voiceName = locale === 'fr'
            ? 'fr-FR-VivienneMultilingualNeural'
            : 'en-US-AndrewMultilingualNeural';

        const tts = new MsEdgeTTS();
        await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

        const { audioStream } = tts.toStream(cleanText, { rate, pitch });

        // Collect audio data
        const chunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
            audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
            audioStream.on('end', () => resolve());
            audioStream.on('error', (err: Error) => reject(err));
        });

        const audioBuffer = Buffer.concat(chunks);

        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error: unknown) {
        console.error('TTS Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'TTS failed';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
