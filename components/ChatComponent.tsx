import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

// Message interface
interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Memoize the AI instance
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY! }), []);

    // Initialize chat session
    useEffect(() => {
        if (!chatRef.current) {
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a friendly and knowledgeable GIS assistant for the Situ Pamulang WebGIS application. Your role is to answer questions based on the provided context about land parcels, control points, and the history of the lake's area. Be concise and helpful. When asked about data, you can refer to the information visible on the map and charts. Do not make up data.",
                }
            });
            setMessages([{ role: 'model', text: 'Hello! How can I help you analyze the Situ Pamulang data today?' }]);
        }
    }, [ai]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (chatRef.current) {
                const stream = await chatRef.current.sendMessageStream({ message: input });
                
                let modelResponse = '';
                setMessages(prev => [...prev, { role: 'model', text: '' }]); // Add empty model message

                for await (const chunk of stream) {
                    modelResponse += chunk.text;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        if(newMessages.length > 0) {
                           newMessages[newMessages.length - 1].text = modelResponse;
                        }
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-lg h-full flex flex-col border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-on-surface dark:text-dark-on-surface mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                GIS Assistant
            </h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-sm lg:max-w-md ${msg.role === 'user' ? 'bg-primary dark:bg-dark-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-on-surface dark:text-dark-on-surface'}`}>
                            {msg.text}
                             {isLoading && msg.role === 'model' && index === messages.length - 1 && (
                                <div className="flex items-center justify-start space-x-1 mt-2">
                                    <span className="sr-only">Loading...</span>
                                    <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-600 pt-4">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Ask about the data..."
                    rows={1}
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary resize-none"
                    disabled={isLoading}
                    aria-label="Chat input"
                />
                <button type="submit" disabled={isLoading} className="p-2 bg-primary dark:bg-dark-primary text-white rounded-md hover:bg-primary-dark dark:hover:bg-opacity-80 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed" aria-label="Send message">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;
