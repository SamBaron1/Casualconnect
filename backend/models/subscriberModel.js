const db = require('../config/database');

const addSubscriber = (email, callback) => {
  const query = 'INSERT INTO newsletter_subscriptions (email) VALUES (?)';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error inserting into newsletter_subscriptions table:', err); // Log detailed error
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = { addSubscriber };
