import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'

interface MarkdownComponentProps {
    key: React.Key | null | undefined
    className?: string
    content: string
}

const MarkdownComponent: React.FunctionComponent<MarkdownComponentProps> = ({ key, className, content }: MarkdownComponentProps) => {
    return (
        <ReactMarkdown
            key={key} className={className}
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <pre className={className}>
                            <code {...props}>{children}</code>
                        </pre>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        />
    )
}

export default MarkdownComponent