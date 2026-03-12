import { useEffect, useRef, useState } from 'react';

function ChatWidget({ open, onOpen, onClose, messages, onSend, loading }) {
  const [value, setValue] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  function submit(event) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  }

  return (
    <>
      <button className="chat-toggle btn btn-primary" onClick={onOpen}>Live Chat</button>

      <section className={`chat-widget ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header>
          <div>
            <h3>24/7 Support</h3>
            <p>Average response under 1 minute</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </header>

        <div className="chat-log" ref={listRef}>
          {loading ? <p className="hint-text">Loading chat history...</p> : null}
          {messages.map((msg, idx) => (
            <p key={`${msg.role}-${idx}`} className={`chat-msg ${msg.role}`}>
              {msg.message}
            </p>
          ))}
        </div>

        <form onSubmit={submit}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type your message..."
            maxLength={280}
            required
          />
          <button className="btn btn-primary" type="submit">Send</button>
        </form>
      </section>
    </>
  );
}

export default ChatWidget;
