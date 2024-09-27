'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation

module.exports = createCoreController('api::coordinator.coordinator', ({ strapi }) => ({
    async create(ctx) {
        const { coor_fname,  coor_lname = '', coor_username, coor_email, coor_password, coor_contact = '', coor_address = '', coor_role = 'Coordinator' } = ctx.request.body.data;
    
        // Validate required fields
        if (!coor_fname || !coor_username || !coor_email || !coor_password) {
            return ctx.badRequest('Please provide all required fields.');
        }
    
        // Check if the email or username already exists
        const existingUsers = await strapi.entityService.findMany('api::coordinator.coordinator', {
            filters: {
                $or: [
                    { coor_email: coor_email },
                    { coor_username: coor_username },
                ],
            },
        });
    
        // Construct error messages
        const errorMessages = [];

        // If the username or email exists, determine which one and send specific error
        if (existingUsers.length > 0) {
            const existingUser = existingUsers[0]; // Get the first existing user for checking

            // Check if the email exists
            if (existingUser.coor_email === coor_email) {
                errorMessages.push('Email is already registered.');
            }

            // Check if the username exists
            if (existingUser.coor_username === coor_username) {
                errorMessages.push('Username is already taken.');
            }
        }

        // Construct a final error message based on what errors were found
        if (errorMessages.length > 0) {
            // If both errors are present, show a combined message
            const combinedMessage = errorMessages.length > 1
                ? `Account already registered.`
                : errorMessages[0]; // Just return the single message if only one exists
            
            return ctx.badRequest(`${combinedMessage} Please try again.`);
        }

        // Create the coordinator entry
        const coordinator = await strapi.entityService.create('api::coordinator.coordinator', {
            data: {
                coor_fname,
                coor_lname,
                coor_username,
                coor_email,
                coor_password,
                coor_contact, 
                coor_address,
                coor_role,
            },
        });
    
        return ctx.send(coordinator);
    },
      
    async login(ctx) {
        const { identifier, password } = ctx.request.body;
    
        // Check for missing fields
        if (!identifier || !password) {
            return ctx.badRequest('Missing identifier or password');
        }
    
        try {
            // Find the coordinator by username or email
            const coordinators = await strapi.entityService.findMany('api::coordinator.coordinator', {
                filters: { 
                    $or: [
                        { coor_username: identifier.trim().toLowerCase() },
                        { coor_email: identifier.trim().toLowerCase() }
                    ]
                }
            });
    
            // If no coordinators found, return an unauthorized response
            if (coordinators.length === 0) {
                return ctx.unauthorized('No existing user found');
            }
    
            const coordinator = coordinators[0];
            const isPasswordValid = await bcrypt.compare(password, coordinator.coor_password);
            if (!isPasswordValid) {
                return ctx.unauthorized('Incorrect Password'); // Return 401 status
            }
    
            // Generate a token
            const token = jwt.sign({ id: coordinator.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Remove password before sending the coordinator data
            const { coor_password, ...sanitizedCoordinator } = coordinator;

            // Send the response
            ctx.send({ coordinator: sanitizedCoordinator, token });
        } catch (error) {
            console.error('Error during login:', error);
            return ctx.internalServerError('Something went wrong');
        }
    },

    async update(ctx) {
        const { id } = ctx.params; // Extract coordinator ID from request parameters
        const { coor_fname, coor_lname, coor_username, coor_email, coor_contact, coor_address, coor_role } = ctx.request.body.data; // Extract data from request body

        // Check if the Authorization header exists
        const token = ctx.request.headers['authorization'];
        if (!token) {
            console.error('No Authorization token provided');
            return ctx.unauthorized('You must be logged in to perform this action');
        }
        
        console.log('Authorization token:', token); // Log token for debugging

        // Basic validation for required fields
        if (!coor_fname || !coor_email) {
            return ctx.badRequest('First name and email are required');
        }

        // Find the existing coordinator by ID
        const existingCoordinator = await strapi.service('api::coordinator.coordinator').findOne(id);
        if (!existingCoordinator) {
            return ctx.notFound('Coordinator not found');
        }

        // Only allow updating the role if the user is an Admin
        const updatedData = {
            coor_fname,
            coor_lname,
            coor_username,
            coor_email,
            coor_contact,
            coor_address,
            coor_role: existingCoordinator.coor_role === 'Admin' ? coor_role : existingCoordinator.coor_role, // Prevent role update unless Admin
        };

        try {
            // Update the coordinator data
            const updatedCoordinator = await strapi.service('api::coordinator.coordinator').update(id, { data: updatedData });
            return ctx.send(updatedCoordinator); // Return the updated coordinator data
        } catch (error) {
            console.error('Error updating coordinator:', error);
            return ctx.internalServerError('Failed to update coordinator data');
        }
    },

    async logout(ctx) {
        console.log('Logout method called'); // Debugging
        ctx.send({ message: 'Logged out successfully' });
    },
    
}));
