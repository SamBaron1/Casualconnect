import React, { useState, useEffect } from "react";
import "./NewsletterManagement.css";

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState(""); // Email-only
  const [bulkMessage, setBulkMessage] = useState("");
  const [error, setError] = useState(null); // Handle errors gracefully
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [subscribersPerPage] = useState(10); // Number of subscribers per page

  // Fetch subscribers from the backend
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    fetch("http://localhost:5000/api/admin/newsletter", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized access. Please log in.");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setSubscribers(data))
      .catch((err) => {
        console.error("Error fetching subscribers:", err.message);
        setError(err.message);
      });
  }, []);

  // Add a subscriber
  const handleAddSubscriber = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    fetch("http://localhost:5000/api/admin/newsletter", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newSubscriberEmail }), // Email-only
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add subscriber.");
        }
        return response.json();
      })
      .then((data) => {
        alert("Subscriber added!");
        setSubscribers((prev) => [...prev, data]);
        setNewSubscriberEmail(""); // Clear email input
        setError(null); // Clear errors
      })
      .catch((err) => {
        console.error("Error adding subscriber:", err.message);
        setError(err.message);
      });
  };

  // Remove a subscriber
  const handleRemoveSubscriber = (email) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    fetch(`http://localhost:5000/api/admin/newsletter/${email}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove subscriber.");
        }
        alert("Subscriber removed!");
        setSubscribers((prev) => prev.filter((sub) => sub.email !== email));
        setError(null); // Clear errors
      })
      .catch((err) => {
        console.error("Error removing subscriber:", err.message);
        setError(err.message);
      });
  };

  // Send newsletter
  const handleSendNewsletter = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    fetch("http://localhost:5000/api/admin/newsletter/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: bulkMessage }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send newsletter.");
        }
        alert("Newsletter sent successfully!");
        setBulkMessage("");
        setError(null); // Clear errors
      })
      .catch((err) => {
        console.error("Error sending newsletter:", err.message);
        setError(err.message);
      });
  };

  // Pagination logic
  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = subscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(subscribers.length / subscribersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="newsletter-management">
      <h2>Newsletter Management</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error messages */}

      {/* Add Subscriber */}
      <div className="add-subscriber">
        <h3>Add Subscriber</h3>
        <input
          type="email"
          placeholder="Email"
          value={newSubscriberEmail}
          onChange={(e) => setNewSubscriberEmail(e.target.value)}
        />
        <button onClick={handleAddSubscriber}>Add Subscriber</button>
      </div>

      {/* List Subscribers */}
      <div className="subscriber-list">
        <h3>Subscribers</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSubscribers.map((subscriber) => (
                <tr key={subscriber.email}>
                  <td data-label="Email">{subscriber.email}</td>
                  <td data-label="Actions">
                    <button onClick={() => handleRemoveSubscriber(subscriber.email)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={prevPage}
            disabled={currentPage === 1} // Disable "Previous" button on the first page
          >
            Previous
          </button>
          {Array.from(
            { length: Math.ceil(subscribers.length / subscribersPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            onClick={nextPage}
            disabled={
              currentPage === Math.ceil(subscribers.length / subscribersPerPage)
            } // Disable "Next" button on the last page
          >
            Next
          </button>
        </div>
      </div>

      {/* Send Newsletter */}
      <div className="send-newsletter">
        <h3>Send Newsletter</h3>
        <textarea
          placeholder="Enter your newsletter message here..."
          value={bulkMessage}
          onChange={(e) => setBulkMessage(e.target.value)}
        ></textarea>
        <button onClick={handleSendNewsletter}>Send Newsletter</button>
      </div>
    </div>
  );
};

export default NewsletterManagement;