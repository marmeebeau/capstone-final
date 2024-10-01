'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/coordinators/register',
      handler: 'coordinator.create', 
      auth: false, // No authentication needed for registration
    },
    {
      method: 'POST',
      path: '/coordinators/login',
      handler: 'coordinator.login', 
      auth: false, 
    },
    {
      method: 'POST',
      path: '/coordinators/logout',
      handler: 'coordinator.logout',
      auth: false, 
    },
    {
      method: 'GET',
      path: '/coordinators',
      handler: 'coordinator.find', 
      auth: true, // Authentication required
    },
    {
      method: 'GET',
      path: '/coordinators/:id',
      handler: 'coordinator.findOne',
      auth: true, // Authentication required
    },
    {
      method: 'PUT',
      path: '/coordinators/:id',
      handler: 'coordinator.update',
      auth: true, // Authentication required
    },
    {
      method: 'POST',
      path: '/coordinators/verify-password',
      handler: 'coordinator.verifyOldPassword',
      auth: true, // Authentication required
    },
  ],
};
