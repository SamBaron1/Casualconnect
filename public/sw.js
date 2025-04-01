/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/jt3.JPG", // Path to a notification icon (optional)
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/dashboard")); // Redirect to a relevant page
});

/* eslint-enable no-restricted-globals */