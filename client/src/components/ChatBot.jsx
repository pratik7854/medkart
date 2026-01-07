import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-yellow-400 text-black p-4 rounded-full shadow-lg hover:bg-yellow-300"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-3 font-semibold">
            MedKart Support
          </div>

          <div className="p-3 text-sm text-gray-700 h-40">
            👋 Hi! How can I help you?
            <br />• Search medicines  
            <br />• Upload prescription  
            <br />• Order status
          </div>

          <input
            type="text"
            placeholder="Type your message..."
            className="w-full border-t p-2 outline-none"
          />
        </div>
      )}
    </>
  );
}
