'use strict';

/**
 * event-package service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event-package.event-package');
