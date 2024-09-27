// src/api/coordinator/controllers/coordinator.js
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation

module.exports = createCoreController('api::coordinator.coordinator', ({ strapi }) => ({
    // Register a new coordinator
    async create(ctx) {
        const { coor_fname, coor_lname = '', coor_username, coor_email, coor_password, coor_contact = '', coor_address = '', coor_role = 'Coordinator' } = ctx.request.body.data;
    
        if (!coor_fname || !coor_username || !coor_email || !coor_password) {
            return ctx.badRequest('Please provide all required fields.');
        }

        // Check if the email or username already exists
        const existingUsers = await strapi.entityService.findMany('api::coordinator.coordinator', {
            filters: {
                $or: [{ coor_email }, { coor_username }],
            },
        });

        if (existingUsers.length > 0) {
            return ctx.badRequest('Username or Email already registered');
        }

        const hashedPassword = await bcrypt.hash(coor_password, 10); // Hash password before saving

        // Create the coordinator entry
        const coordinator = await strapi.entityService.create('api::coordinator.coordinator', {
            data: {
                coor_fname,
                coor_lname,
                coor_username,
                coor_email,
                coor_password: hashedPassword,
                coor_contact,
                coor_address,
                coor_role,
            },
        });

        return ctx.send(coordinator);
    },

    // Login controller
    async login(ctx) {
        const { identifier, password } = ctx.request.body;

        if (!identifier || !password) {
            return ctx.badRequest('Missing identifier or password');
        }

        // Find the coordinator by username or email
        const coordinators = await strapi.entityService.findMany('api::coordinator.coordinator', {
            filters: {
                $or: [
                    { coor_username: identifier.trim().toLowerCase() },
                    { coor_email: identifier.trim().toLowerCase() },
                ],
            },
        });

        if (coordinators.length === 0) {
            return ctx.unauthorized('No existing user found');
        }

        const coordinator = coordinators[0];
        const isPasswordValid = await bcrypt.compare(password, coordinator.coor_password);

        if (!isPasswordValid) {
            return ctx.unauthorized('Incorrect Password');
        }

        // Generate a JWT token
        const token = jwt.sign({ id: coordinator.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Sanitize the response to exclude password
        const { coor_password, ...sanitizedCoordinator } = coordinator;

        return ctx.send({ coordinator: sanitizedCoordinator, token });
    },

    // Update coordinator data
    async update(ctx) {
        const { id } = ctx.params;
        const { coor_fname, coor_lname, coor_username, coor_email, coor_contact, coor_address, coor_role } = ctx.request.body.data;

        const existingCoordinator = await strapi.entityService.findOne('api::coordinator.coordinator', id);

        if (!existingCoordinator) {
            return ctx.notFound('Coordinator not found');
        }

        const updatedData = {
            coor_fname,
            coor_lname,
            coor_username,
            coor_email,
            coor_contact,
            coor_address,
            coor_role: existingCoordinator.coor_role === 'Admin' ? coor_role : existingCoordinator.coor_role,
        };

        const updatedCoordinator = await strapi.entityService.update('api::coordinator.coordinator', id, { data: updatedData });

        return ctx.send(updatedCoordinator);
    },

    // Logout (simply a placeholder)
    async logout(ctx) {
        ctx.send({ message: 'Logged out successfully' });
    },
}));
