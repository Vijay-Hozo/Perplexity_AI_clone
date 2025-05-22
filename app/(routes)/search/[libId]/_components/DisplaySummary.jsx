import React from "react";
import ReactMarkdown from "react-markdown";

function DisplaySummery({ aiResp }) {
  return (
    <div className="mt-7">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-gray-900 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-semibold text-gray-800 mb-3"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-semibold text-gray-700 mb-2"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside mb-4 pl-4 text-gray-700"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          code: ({ node, inline, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div>{children}</div>
            ) : (
              <code
                className="bg-gray-100 rounded-md p-1 text-sm text-gray-800"
                {...props}
              >
                {" "}
                {children}
              </code>
            );
          },
        }}
      >
        {aiResp}
      </ReactMarkdown>
    </div>
  );
}

export default DisplaySummery;
