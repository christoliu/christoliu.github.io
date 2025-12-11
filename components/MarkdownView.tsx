import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ImageWithFallback } from './ImageWithFallback';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  return (
    <article className="prose prose-slate prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          img: ({node, ...props}) => (
            <div className="my-6 rounded-xl overflow-hidden shadow-md bg-slate-50 h-64 md:h-96">
               <ImageWithFallback 
                 {...props} 
                 src={typeof props.src === 'string' ? props.src : undefined} 
                 className="w-full h-full" 
                 alt={props.alt || 'Travel image'} 
               />
            </div>
          ),
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-slate-800 mt-6 mb-3" {...props} />,
          p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700" {...props} />,
          blockquote: ({node, ...props}) => (
            <div className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-50 italic text-slate-700 rounded-r">
              {props.children}
            </div>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};