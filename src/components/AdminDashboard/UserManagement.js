import React, { useState, useEffect } from "react";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [usersPerPage] = useState(10); // Number of users per page

  // Fetch all users from the backend
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    fetch("http://localhost:5000/api/admin/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users); // Set the users state
        } else {
          console.error("Unexpected API response:", data);
          setUsers([]); // Fallback to an empty array
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authorization token missing.");
      return;
    }

    fetch(`http://localhost:5000/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user.");
        }
        alert("User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      })
      .catch((err) => {
        console.error("Error deleting user:", err.message);
      });
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Users"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Users Table */}
      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td data-label="Name">{user.name}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Role">{user.role}</td>
                <td data-label="Status">{user.status}</td>
                <td data-label="Actions">
                  <button
                    className="btn delete"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
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
          { length: Math.ceil(filteredUsers.length / usersPerPage) },
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
            currentPage === Math.ceil(filteredUsers.length / usersPerPage)
          } // Disable "Next" button on the last page
        >
          Next
        </button>
      </div>

      {filteredUsers.length === 0 && <p className="no-users">No users found!</p>}
    </div>
  );
};

export default UserManagement;