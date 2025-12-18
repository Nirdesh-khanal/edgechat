import React, { useEffect, useRef } from "react";

const MessageList = ({ messages, scrollTrigger }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const wasNearBottomRef = useRef(true);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
        behavior: smooth ? "smooth" : "auto",
        block: "end",
    });
  };

  // Track scroll position
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    // Consider near bottom if within 100px
    const isNear = scrollHeight - scrollTop - clientHeight < 150;
    wasNearBottomRef.current = isNear;
  };

  useEffect(() => {
    // Smart scroll logic
    const isNewMessage = messages.length > prevMessagesLength.current;

    // Scroll if we WERE near bottom before this update, or if it's the first load
    if (prevMessagesLength.current === 0 && messages.length > 0) {
        scrollToBottom(false); // Instant scroll on first load
    } else if (isNewMessage && wasNearBottomRef.current) {
        // Use timeout to handle long text rendering delays
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }

    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Force scroll when user takes action (send)
  useEffect(() => {
    if (scrollTrigger > 0) {
        // Small timeout to ensure DOM layout (especially for long text wrapping) is complete
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }
  }, [scrollTrigger]);

  if (!messages || !Array.isArray(messages))
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No messages yet. Start the conversation!
      </div>
    );

  return (
    <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 dark:bg-gray-900 bg-gray-50 transition-colors duration-200"
    >
      {messages.map((msg, index) => {
        const isMe = msg.is_me;
        const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender?.id !== msg.sender?.id;
        
        return (
          <div
            key={msg.id}
            className={`flex ${isMe ? "justify-end" : "justify-start"} px-2`}
          >
            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] lg:max-w-[70%]`}>
              <div 
                className={`relative px-5 py-3 shadow-sm text-sm md:text-base transition-all duration-200
                ${isMe 
                    ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                    : "dark:bg-gray-800 bg-white dark:text-gray-100 text-gray-800 rounded-2xl rounded-tl-sm border dark:border-gray-700/50 border-gray-200 shadow-sm"
                }
                ${isLastInGroup && !isMe ? "mb-1" : "mb-0.5"}
                `}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {/* Image Attachment */}
                {msg.image && (
                    <div className="mt-2 mb-1 rounded-lg overflow-hidden">
                        <img src={msg.image} alt="attachment" className="max-w-full max-h-60 object-cover rounded-lg" />
                    </div>
                )}
                {/* File Attachment */}
                {msg.file && (
                    <div className="mt-2 mb-1">
                        <a 
                            href={msg.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                                isMe 
                                    ? "bg-blue-700/50 hover:bg-blue-700 text-white" 
                                    : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.414l5 5a1 1 0 01.414 1.414V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="truncate max-w-37.5">Download File</span>
                        </a>
                    </div>
                )}
                
                {/* Timestamp inside bubble */}
                <div className={`text-[10px] mt-1 text-right w-full block
                    ${isMe ? "text-blue-200/70" : "dark:text-gray-500 text-gray-400"}
                `}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {(!isMe && isLastInGroup) && (
                 <span className="text-[10px] text-gray-500 ml-1 mt-1 mb-2">
                    {msg.sender?.username}
                 </span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;