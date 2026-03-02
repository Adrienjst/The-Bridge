'use client';

import React, { useState } from 'react';
import { Play, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { CodeEditor } from './CodeEditor';

interface CodeRunnerProps {
    language: 'python' | 'cpp' | 'javascript';
    initialCode: string;
    expectedOutput?: string;
}

// Piston API language mapping
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

            const response = await fetch('https://emacsx.com/api/v2/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: langConfig.language,
                    version: langConfig.version,
                    files: [
                        {
                            content: code,
                        },
                    ],
                }),
            });

            const result = await response.json();

            if (result.run.stderr) {
                setError(result.run.stderr);
            } else if (result.compile && result.compile.stderr) {
                setError(result.compile.stderr);
            } else {
                const stdout = result.run.stdout;
                setOutput(stdout);

                // If there's an expected output, verify it
                if (expectedOutput) {
                    const cleanStdout = stdout.trim();
                    const cleanExpected = expectedOutput.trim();
                    setSuccess(cleanStdout === cleanExpected);
                }
            }
        } catch (err) {
            setError("Erreur de connexion a l'interface d'execution.");
            console.error(err);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors ${isRunning
                                ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'
                            }`}
                    >
                        {isRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                        {isRunning ? 'Exécution...' : 'Run Code'}
                    </button>
                </div>

                <CodeEditor
                    language={language}
                    initialCode={code}
                    onChange={setCode}
                    height="400px"
                />
            </div>

            {/* Results Console */}
            {(output || error) && (
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm border border-slate-700 shadow-inner overflow-x-auto">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                        <span className="text-slate-400 font-semibold">Console Output</span>
                        {success !== null && (
                            <div className={`flex items-center gap-1 ${success ? 'text-green-400' : 'text-red-400'}`}>
                                {success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                <span>{success ? 'Correct!' : 'Incorrect'}</span>
                            </div>
                        )}
                    </div>

                    {error ? (
                        <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
                    ) : (
                        <pre className="text-green-300 whitespace-pre-wrap">{output}</pre>
                    )}
                </div>
            )}
        </div>
    );
};
