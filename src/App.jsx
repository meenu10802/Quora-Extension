import React, { useState } from 'react';
import { sendMessage } from './notification';

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://visitsaudiai.com/api/v1/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      console.log(data.data);
      setResponse(data.data);
      sendMessage('Response received', 'Review or copy the content', data.data);
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  };

  const handleReview = () => {
    alert(response);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert('Copied to clipboard');
  };

  return (
    <div>
      <h1>SubEngage  Chrome Extension</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <button onClick={handleReview}>Review</button>
          <button onClick={handleCopy}>Copy to Clipboard</button>
        </div>
      )}
    </div>
  );
};

export default App;