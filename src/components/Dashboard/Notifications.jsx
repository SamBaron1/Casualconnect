import React from "react";

const Notifications = ({ notifications }) => {
  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>
            <span role="img" aria-label="notification">
              🔔
            </span>{" "}
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
