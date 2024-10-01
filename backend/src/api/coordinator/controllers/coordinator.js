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

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(coor_password, 10);
    
        // Create the coordinator entry
        const coordinator = await strapi.entityService.create('api::coordinator.coordinator', {
            data: {
                coor_fname,
                coor_lname,
                coor_username,
                coor_email,
                coor_password: hashedPassword,
                coor_role,
                coor_contact, 
                coor_address,
            },
        });
    
        return ctx.send(coordinator);
    },


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
        console.log('Retrieved User for Login:', coordinator); // Log the user object
    
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password.trim(), coordinator.coor_password);
        console.log('Entered Password:',); // Log the entered password
        console.log('Stored Hashed Password:', coordinator.coor_password); // Log the stored hash
        console.log('Password Comparison Result:', isPasswordValid); // Log the comparison result
    
        if (!isPasswordValid) {
            return ctx.unauthorized('Incorrect Password');
        }
    
        // Generate a JWT token
        const token = jwt.sign({ id: coordinator.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
        // Sanitize the response to exclude password
        const { coor_password, ...sanitizedCoordinator } = coordinator;
    
        return ctx.send({ coordinator: sanitizedCoordinator, token });
    },

    async findOne(ctx) {
        const {id} = ctx.params;
        return ctx.send(id);
    },

    // Update coordinator data
    async update(ctx) {
        const { id } = ctx.params;
        const { coor_fname, coor_lname, coor_username, coor_email, coor_password, old_password, coor_contact, coor_address, coor_role } = ctx.request.body.data;
        
        const existingCoordinator = await strapi.entityService.findOne('api::coordinator.coordinator', id);
        
        if (!existingCoordinator) {
            return ctx.notFound('Coordinator not found');
        }
        
        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(old_password, existingCoordinator.coor_password);
        
        if (!isOldPasswordValid) {
            return ctx.unauthorized('Old password is incorrect');
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
        
        // Check if a new password was provided
        if (coor_password) {
            console.log('New Password:', coor_password); // Log the new password before hashing
            if (await bcrypt.compare(coor_password, existingCoordinator.coor_password)) {
                return ctx.badRequest('New password is the same as the old password');
            }
            const hashedPassword = await bcrypt.hash(coor_password, 10);
            console.log('New Password Hashed:', hashedPassword); // Log the new hashed password
            updatedData.coor_password = existingCoordinator.coor_password;
        }
        
        // Update the coordinator in the database
        const updatedCoordinator = await strapi.entityService.update('api::coordinator.coordinator', id, { data: updatedData });
        
        // Optionally, sanitize the response to exclude the password
        const { coor_password: _, ...sanitizedCoordinator } = updatedCoordinator; // Rename coor_password to _ to avoid conflict
        
        return ctx.send(sanitizedCoordinator); // Send back the updated coordinator without the password
    },

    // Verify old password
    async verifyOldPassword(ctx) {
        const { userId, oldPassword } = ctx.request.body;
    
        // Find the user
        const user = await strapi.entityService.findOne('api::coordinator.coordinator', userId);
        if (!user) {
            return ctx.notFound('User not found');
        }
    
        // Compare the old password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(oldPassword, user.coor_password); // Ensure you have the correct field for the hashed password
        if (!passwordMatch) {
            return ctx.forbidden('Incorrect password'); // or ctx.badRequest('Incorrect password');
        }
    
        return ctx.send({ success: true });
    },

    // Get all coordinators (for admin only)
    async getAllCoordinators(ctx) {
        // Optional: Check if user is admin
        const userId = ctx.state.user.id; // Assuming the user ID is set in the context after authentication
        const user = await strapi.entityService.findOne('api::coordinator.coordinator', userId);

        if (!user || user.coor_role !== 'Admin') {
            return ctx.unauthorized('You do not have permission to access this resource.');
        }

        // Fetch all coordinators from the database
        const coordinators = await strapi.entityService.findMany('api::coordinator.coordinator');
        return ctx.send(coordinators);
    },

    // Logout (simply a placeholder)
    async logout(ctx) {
        ctx.send({ message: 'Logged out successfully' });
    },
}));
