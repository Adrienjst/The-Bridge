'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface LatexProps {
    children: string;
    className?: string;
    block?: boolean;
}

const crystalTransition = {
    type: 'spring',
    stiffness: 280,
    damping: 26,
};

const animationProps = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { ...crystalTransition },
};

const wrapAnimatedText = (content: ReactNode, prefix = ''): ReactNode => {
    return React.Children.map(content, (child, index) => {
        const key = `${prefix}-${index}`;

        if (typeof child === 'string' || typeof child === 'number') {
            const str = String(child);
            return str.split('').map((letter, idx) => (
                <motion.span
                    key={`${key}-${idx}`}
                    {...animationProps}
                    style={{ display: 'inline-flex', whiteSpace: 'pre', lineHeight: 1.6 }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ));
        }

        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                ...child.props,
                children: wrapAnimatedText(child.props.children, `${key}`),
            });
        }

        return child;
    });
};

const AnimatedParagraph = motion('p');
const AnimatedSpan = motion('span');

const animatedVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
};

const createAnimatedComponent =
    (displayName: string, Component: typeof AnimatedSpan, defaultStyle: React.CSSProperties = {}) => {
    const animated = ({ node, ...props }: Record<string, unknown>) => {
        void node;
        return (
            <Component
                {...animationProps}
                variants={animatedVariants}
                style={{ ...defaultStyle, ...(props.style as React.CSSProperties) }}
                {...props}
            >
                {wrapAnimatedText(props.children)}
            </Component>
        );
    };
    animated.displayName = displayName;
    return animated;
};
const AnimatedFlowParagraph = createAnimatedComponent('AnimatedFlowParagraph', AnimatedParagraph, {
    marginBottom: '0.75rem',
    lineHeight: 1.6,
});
const AnimatedInline = createAnimatedComponent('AnimatedInline', AnimatedSpan);
const AnimatedStrong = createAnimatedComponent('AnimatedStrong', AnimatedSpan, { fontWeight: 700 });
const AnimatedEmphasis = createAnimatedComponent('AnimatedEmphasis', AnimatedSpan, { fontStyle: 'italic' });
const AnimatedCode = createAnimatedComponent('AnimatedCode', AnimatedSpan, {
    fontFamily: 'var(--font-code)',
    background: 'rgba(148,163,184,0.12)',
    padding: '0.15rem 0.35rem',
    borderRadius: 4,
});

/**
 * Renders text with inline ($...$) and block ($$...$$) LaTeX expressions,
 * as well as Markdown (including tables, bold, etc) with a crystal animation.
 */
export default function Latex({ children, className, block = false }: LatexProps) {
    if (!children) return null;

    const paragraphComponent = block ? AnimatedFlowParagraph : AnimatedInline;
    const components = {
        p: paragraphComponent,
        span: AnimatedInline,
        strong: AnimatedStrong,
        em: AnimatedEmphasis,
        code: AnimatedCode,
        table: ({ node, ...props }: Record<string, unknown>) => {
            void node;
            return (
                <div className="table-responsive">
                    <table className="markdown-table" {...props} />
                </div>
            );
        },
        a: ({ node, ...props }: Record<string, unknown>) => {
            void node;
            return <a target="_blank" rel="noopener noreferrer" {...props} />;
        },
    };

    return (
        <span className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={components}
            >
                {children}
            </ReactMarkdown>
        </span>
    );
}
