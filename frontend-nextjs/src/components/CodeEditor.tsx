'use client';

import React, { useRef, useState, useEffect } from 'react';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';

interface CodeEditorProps {
    language: 'python' | 'cpp' | 'javascript';
    initialCode: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    language,
    initialCode,
    onChange,
    readOnly = false,
    height = '340px'
}) => {
    const editorRef = useRef<any>(null);
    const monaco = useMonaco();
    const [value, setValue] = useState(initialCode);

    useEffect(() => {
        setValue(initialCode);
    }, [initialCode]);

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };

    const handleChange = (value: string | undefined) => {
        const newValue = value || '';
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const langLabel = language === 'cpp' ? 'C++' : language === 'python' ? 'Python' : 'JavaScript';

    return (
        <div style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            background: '#0d1117',
        }}>
            {/* Editor Header Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid var(--border)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                    </div>
                    <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginLeft: '0.5rem',
                    }}>
                        {langLabel}
                    </span>
                </div>
                {readOnly && (
                    <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontWeight: 500,
                    }}>
                        Lecture seule
                    </span>
                )}
            </div>

            <Editor
                height={height}
                language={language === 'cpp' ? 'cpp' : language}
                theme="vs-dark"
                value={value}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                    fontLigatures: true,
                    renderLineHighlight: 'gutter',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                    bracketPairColorization: { enabled: true },
                }}
            />
        </div>
    );
};
