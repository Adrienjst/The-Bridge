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
    height = '300px'
}) => {
    const editorRef = useRef<any>(null);
    const monaco = useMonaco();
    const [value, setValue] = useState(initialCode);

    // Update value if initialCode changes externally
    useEffect(() => {
        setValue(initialCode);
    }, [initialCode]);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Setup initial config if needed (like theme or specific language options)
    };

    const handleChange = (value: string | undefined) => {
        const newValue = value || '';
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e]">
            <Editor
                height={height}
                language={language}
                theme="vs-dark"
                value={value}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace",
                }}
            />
        </div>
    );
};
