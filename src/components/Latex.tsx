'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface LatexProps {
    children: string;
    className?: string;
    block?: boolean;
}

/**
 * Renders text with inline ($...$) and block ($$...$$) LaTeX expressions,
 * as well as Markdown (including tables, bold, etc).
 */
export default function Latex({ children, className, block = false }: LatexProps) {
    if (!children) return null;

    return (
        <span className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // If block is false, avoid rendering <p> which is block-level
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    p: ({ node, ...props }) => {
                        if (block) return <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }} {...props} />;
                        return <span {...props} />;
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    table: ({ node, ...props }) => (
                        <div className="table-responsive">
                            <table className="markdown-table" {...props} />
                        </div>
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    a: ({ node, ...props }) => (
                        <a target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </span>
    );
}
