import React, { useState } from 'react';
import { subscribeToNewsletter } from '../services/api';
import './NewsLetter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await subscribeToNewsletter(email);
      setMessage(result.message); // Successful subscription message
      setEmail(''); // Clear the input field
    } catch (error) {
      // Handle specific errors
      if (error.message.includes('already subscribed')) {
        setMessage('You are already subscribed!');
      } else {
        setMessage('Failed to subscribe. Try again later.');
      }
    }
  };

  return (
    <section className="newsletter">
      <p>Join our newsletter and get the latest updates.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="newsletter-button">Notify Me</button>
      </form>
      {message && <p className="message">{message}</p>}
    </section>
  );
};

export default Newsletter;