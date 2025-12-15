import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { ImageWithFallback } from './ImageWithFallback';

interface MarkdownViewProps {
  content: string;
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'titlebox'],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    titlebox: ['variant']
  }
};

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  return (
    <article className="prose prose-slate prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={
          {
            img: ({ node, ...props }) => (
              <div className="my-6 rounded-xl overflow-hidden shadow-md bg-slate-50 h-64 md:h-96">
                <ImageWithFallback
                  {...props}
                  src={typeof props.src === 'string' ? props.src : undefined}
                  className="w-full h-full"
                  alt={props.alt || 'Travel image'}
                />
              </div>
            ),
            titlebox: ({ node, ...props }) => {
              const variant = (props as any).variant as string | undefined;

              const styleMap: Record<string, string> = {
                default: 'border-slate-400 text-slate-800',
                price: 'border-2 border-indigo-500 bg-slate-100 text-slate-900',
                note: 'border-blue-500 bg-blue-50 text-blue-700',
                warning: 'border-red-500 bg-red-50 text-red-700'
              };

              const style = styleMap[variant ?? 'default'] ?? styleMap.default;

              return (
                <div className={`my-2 w-fit border px-4 py-2 font-medium rounded-xl ${style}`}>{props.children}</div>
              );
            },
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-slate-800 mt-6 mb-3" {...props} />,
            p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <div className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-50 italic text-slate-700 rounded-r">
                {props.children}
              </div>
            )
          } as any
        }
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
