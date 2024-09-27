'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/coordinators/register',
      handler: 'coordinator.create', // Call the create method in the coordinator controller
      auth: false, // No authentication needed for registration
    },
    {
      method: 'POST',
      path: '/coordinators/login',
      handler: 'coordinator.login', // Call the login method in the coordinator controller
      auth: false, // No authentication needed for login
    },
    {
      method: 'POST',
      path: '/coordinators/logout',
      handler: 'coordinator.logout', // Call the logout method in the coordinator controller
      auth: false, // No authentication needed for logout
    },
    {
      method: 'GET',
      path: '/coordinators',
      handler: 'coordinator.find', // Optional: to fetch all coordinators
      auth: true, // Authentication required
    },
    {
      method: 'GET',
      path: '/coordinators/:id',
      handler: 'coordinator.findOne', // Optional: to fetch a specific coordinator
      auth: true, // Authentication required
    },
    {
      method: 'PUT',
      path: '/coordinators/:id',
      handler: 'coordinator.update',
      auth: false, // Authentication required
    },
  ],
};
