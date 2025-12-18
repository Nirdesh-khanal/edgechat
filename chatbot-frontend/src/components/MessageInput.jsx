import React, { useState, useRef } from "react";

const MessageInput = ({ roomId, onSend }) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setIsSending(true);
    try {
      await onSend(text.trim(), selectedFile);
      setText("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 dark:bg-gray-900/95 bg-white/95 backdrop-blur-md border-t dark:border-gray-800 border-gray-200 absolute bottom-0 w-full lg:relative transition-colors duration-200">
      {selectedFile && (
        <div className="max-w-5xl mx-auto mb-2 px-2">
            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-700 border-gray-200">
                <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
                <button onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }} className="text-gray-500 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <div className="relative flex items-end gap-2 dark:bg-gray-800/50 bg-gray-100 dark:border-gray-700/50 border-gray-200 rounded-2xl border p-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all duration-300 shadow-lg">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                title="Attach file"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
            </button>
          <textarea
            ref={inputRef}
            className="w-full bg-transparent border-0 rounded-xl px-4 py-3 
                     dark:text-gray-100 text-gray-900 dark:placeholder-gray-500 placeholder-gray-400 focus:ring-0 resize-none min-h-12.5 max-h-32
                     scrollbar-thin dark:scrollbar-thumb-gray-600 scrollbar-thumb-gray-400 font-sans text-sm md:text-base leading-relaxed"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
            disabled={isSending}
            style={{ height: 'auto' }} // Auto-grow logic should be here or handled via state, for now resizing manually or fixed
          />
          
          <div className="flex flex-col gap-1 pb-1 pr-1">
               <button
                onClick={handleSend}
                disabled={(!text.trim() && !selectedFile) || isSending}
                className="p-3 bg-blue-600 text-white rounded-xl 
                         hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500
                         transition-all duration-200 flex items-center justify-center shrink-0 shadow-md"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                )}
              </button>
          </div>
        </div>
        <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-600 font-mono tracking-wide">
                <span className="hidden md:inline">RETURN to send • SHIFT + RETURN to add line</span>
                <span className="md:hidden">Tap arrow to send</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;