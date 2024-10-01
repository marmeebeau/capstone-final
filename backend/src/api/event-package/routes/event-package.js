module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/event-packages',
        handler: 'event-packages.find',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/event-packages/:id',
        handler: 'event-packages.findOne',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/event-packages',
        handler: 'event-packages.create',
        config: {
          policies: [],
        },
      },
      {
        method: 'PUT',
        path: '/event-packages/:id',
        handler: 'event-packages.update',
        config: {
          policies: [],
        },
      },
      {
        method: 'DELETE',
        path: '/event-packages/:id',
        handler: 'event-packages.delete',
        config: {
          policies: [],
        },
      },
    ],
  };
  