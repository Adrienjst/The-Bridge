import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { language, code } = body;

        if (language === 'cpp') {
            return await executeCpp(code);
        }

        // Fallback — should not be needed for Python/JS (handled client-side)
        return NextResponse.json(
            { error: `Language "${language}" is not supported server-side. Use client-side execution.` },
            { status: 400 }
        );
    } catch (error) {
        console.error('Code execution proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function executeCpp(code: string) {
    try {
        const response = await fetch('https://godbolt.org/api/compiler/g132/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                source: code,
                options: {
                    userArguments: '-O2',
                    filters: {
                        execute: true,
                    },
                },
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json({ stdout: '', stderr: `Compilation error (HTTP ${response.status}): ${text}` });
        }

        const text = await response.text();

        // Parse Godbolt's text output
        let stdout = '';
        let stderr = '';
        let inStdout = false;

        const lines = text.split('\n');
        for (const line of lines) {
            if (line.startsWith('# Standard out:')) {
                inStdout = true;
                continue;
            }
            if (line.startsWith('# Standard error:') || line.startsWith('# Compiler returned:')) {
                inStdout = false;
                continue;
            }
            if (line.startsWith('# Execution result')) continue;
            if (line.startsWith('#')) continue;

            if (inStdout) {
                stdout += line + '\n';
            }
        }

        // Check for compilation errors in the raw output
        if (text.includes('Compilation failed') || text.includes('error:')) {
            // Find compilation error lines
            const errorLines = lines.filter(l => l.includes('error:') || l.includes('Error'));
            stderr = errorLines.join('\n') || 'Compilation failed';
        }

        return NextResponse.json({
            stdout: stdout.trimEnd(),
            stderr: stderr,
        });
    } catch (err) {
        return NextResponse.json({
            stdout: '',
            stderr: 'Erreur de connexion au compilateur C++.',
        });
    }
}
