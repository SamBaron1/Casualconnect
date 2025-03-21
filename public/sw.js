/* eslint-disable no-restricted-globals */
self.addEventListener("push", (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/jt3.JPG", // Path to a notification icon (optional)
    });
  });
  /* eslint-enable no-restricted-globals */