'use client';

import React, { useState } from 'react';
import { Play, Loader2, CheckCircle2, XCircle, Terminal, RotateCcw } from 'lucide-react';
import { CodeEditor } from './CodeEditor';

interface CodeRunnerProps {
    language: 'python' | 'cpp' | 'javascript';
    initialCode: string;
    expectedOutput?: string;
}

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    python: { language: 'python', version: '3.10.0' },
    cpp: { language: 'c++', version: '10.2.0' },
    javascript: { language: 'javascript', version: '18.15.0' },
};

export const CodeRunner: React.FC<CodeRunnerProps> = ({
    language,
    initialCode,
    expectedOutput
}) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    const runCode = async () => {
        setIsRunning(true);
        setOutput(null);
        setError(null);
        setSuccess(null);

        try {
            const langConfig = LANGUAGE_MAP[language];

            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: langConfig.language,
                    version: langConfig.version,
                    files: [{ content: code }],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (result.compile && result.compile.stderr) {
                setError(result.compile.stderr);
            } else if (result.run?.stderr) {
                setError(result.run.stderr);
            } else {
                const stdout = result.run?.stdout || '';
                setOutput(stdout);

                if (expectedOutput) {
                    setSuccess(stdout.trim() === expectedOutput.trim());
                }
            }
        } catch (err) {
            console.error(err);
            setError("Erreur de connexion au serveur d'exécution. Vérifiez votre connexion internet et réessayez.");
        } finally {
            setIsRunning(false);
        }
    };

    const resetCode = () => {
        setCode(initialCode);
        setOutput(null);
        setError(null);
        setSuccess(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            {/* Editor */}
            <div style={{ position: 'relative' }}>
                <CodeEditor
                    language={language}
                    initialCode={code}
                    onChange={setCode}
                    height="340px"
                />
            </div>

            {/* Action Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}>
                <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="btn btn-primary"
                    style={{
                        opacity: isRunning ? 0.6 : 1,
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        background: isRunning ? 'var(--bg-glass)' : 'var(--gradient-green)',
                        boxShadow: isRunning ? 'none' : '0 0 16px rgba(16, 185, 129, 0.2)',
                    }}
                >
                    {isRunning ? (
                        <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <Play style={{ width: 16, height: 16 }} />
                    )}
                    {isRunning ? 'Exécution...' : 'Exécuter'}
                </button>

                <button
                    onClick={resetCode}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem' }}
                >
                    <RotateCcw style={{ width: 14, height: 14 }} />
                    Reset
                </button>

                {success !== null && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginLeft: 'auto',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: success ? 'var(--green)' : 'var(--red)',
                    }}>
                        {success ? <CheckCircle2 style={{ width: 16, height: 16 }} /> : <XCircle style={{ width: 16, height: 16 }} />}
                        {success ? 'Correct !' : 'Incorrect'}
                    </div>
                )}
            </div>

            {/* Console Output */}
            {(output !== null || error !== null) && (
                <div style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                }}>
                    {/* Console Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid var(--border)',
                    }}>
                        <Terminal style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}>
                            Console
                        </span>
                    </div>

                    {/* Console Body */}
                    <div style={{
                        padding: '1rem',
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontSize: '0.8rem',
                        lineHeight: 1.7,
                        maxHeight: 240,
                        overflowY: 'auto',
                    }}>
                        {error ? (
                            <pre style={{
                                color: '#f87171',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                margin: 0,
                            }}>{error}</pre>
                        ) : (
                            <pre style={{
                                color: '#34d399',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                margin: 0,
                            }}>{output}</pre>
                        )}
                    </div>
                </div>
            )}

            {/* Spin animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
