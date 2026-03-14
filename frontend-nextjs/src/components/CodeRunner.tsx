'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Play, Loader2, CheckCircle2, XCircle, Terminal, RotateCcw } from 'lucide-react';
import { CodeEditor } from './CodeEditor';

interface CodeRunnerProps {
    language: 'python' | 'cpp' | 'javascript';
    initialCode: string;
    expectedOutput?: string;
}

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
    const pyodideRef = useRef<any>(null);
    const pyodideLoadingRef = useRef(false);

    // Load Pyodide for Python execution
    const loadPyodide = useCallback(async () => {
        if (pyodideRef.current) return pyodideRef.current;
        if (pyodideLoadingRef.current) {
            // Wait for existing load
            while (pyodideLoadingRef.current && !pyodideRef.current) {
                await new Promise(r => setTimeout(r, 200));
            }
            return pyodideRef.current;
        }

        pyodideLoadingRef.current = true;
        try {
            // Dynamically load Pyodide from CDN
            if (!(window as any).loadPyodide) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
                document.head.appendChild(script);
                await new Promise<void>((resolve, reject) => {
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Pyodide'));
                });
            }
            const pyodide = await (window as any).loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
            });
            // Pre-load numpy
            await pyodide.loadPackage('numpy');
            pyodideRef.current = pyodide;
            return pyodide;
        } finally {
            pyodideLoadingRef.current = false;
        }
    }, []);

    // Execute Python via Pyodide (client-side WASM)
    const runPython = async (sourceCode: string) => {
        const pyodide = await loadPyodide();

        // Capture stdout
        pyodide.runPython(`
import sys, io
__stdout_capture = io.StringIO()
sys.stdout = __stdout_capture
`);

        try {
            await pyodide.runPythonAsync(sourceCode);
            const stdout = pyodide.runPython('__stdout_capture.getvalue()');
            return { stdout: stdout || '', stderr: '' };
        } catch (err: any) {
            return { stdout: '', stderr: err.message || String(err) };
        } finally {
            pyodide.runPython('sys.stdout = sys.__stdout__');
        }
    };

    // Execute JavaScript in a sandboxed Function
    const runJavaScript = async (sourceCode: string) => {
        const logs: string[] = [];
        const mockConsole = {
            log: (...args: any[]) => logs.push(args.map(String).join(' ')),
            error: (...args: any[]) => logs.push('[ERROR] ' + args.map(String).join(' ')),
            warn: (...args: any[]) => logs.push('[WARN] ' + args.map(String).join(' ')),
        };

        try {
            const fn = new Function('console', 'Math', sourceCode);
            fn(mockConsole, Math);
            return { stdout: logs.join('\n'), stderr: '' };
        } catch (err: any) {
            return { stdout: logs.join('\n'), stderr: err.message || String(err) };
        }
    };

    // Execute C++ via our API proxy (Godbolt)
    const runCpp = async (sourceCode: string) => {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: 'cpp', code: sourceCode }),
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        return await response.json();
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput(null);
        setError(null);
        setSuccess(null);

        try {
            let result: { stdout: string; stderr: string };

            if (language === 'python') {
                result = await runPython(code);
            } else if (language === 'javascript') {
                result = await runJavaScript(code);
            } else {
                result = await runCpp(code);
            }

            if (result.stderr) {
                setError(result.stderr);
                if (result.stdout) setOutput(result.stdout);
            } else {
                setOutput(result.stdout || '(aucune sortie)');
                if (expectedOutput) {
                    setSuccess(result.stdout.trim() === expectedOutput.trim());
                }
            }
        } catch (err: any) {
            console.error(err);
            setError("Erreur de connexion au serveur d'exécution. Réessayez dans un instant.");
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

    const runLabel = language === 'python' && !pyodideRef.current && isRunning
        ? 'Chargement Python...'
        : isRunning ? 'Exécution...' : 'Exécuter';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            {/* Editor */}
            <CodeEditor
                language={language}
                initialCode={code}
                onChange={setCode}
                height="340px"
            />

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    {runLabel}
                </button>

                <button onClick={resetCode} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
                    <RotateCcw style={{ width: 14, height: 14 }} />
                    Reset
                </button>

                {success !== null && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 600,
                        color: success ? 'var(--green)' : 'var(--red)',
                    }}>
                        {success ? <CheckCircle2 style={{ width: 16, height: 16 }} /> : <XCircle style={{ width: 16, height: 16 }} />}
                        {success ? 'Correct !' : 'Incorrect'}
                    </div>
                )}
            </div>

            {/* Console */}
            {(output !== null || error !== null) && (
                <div style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid var(--border)',
                    }}>
                        <Terminal style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>Console</span>
                    </div>

                    <div style={{
                        padding: '1rem',
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontSize: '0.8rem', lineHeight: 1.7,
                        maxHeight: 240, overflowY: 'auto',
                    }}>
                        {error && (
                            <pre style={{ color: '#f87171', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{error}</pre>
                        )}
                        {output && (
                            <pre style={{ color: '#34d399', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{output}</pre>
                        )}
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
