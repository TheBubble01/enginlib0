const request = require('supertest');
const app = require('../app'); // Assuming your express app is exported from app.js
const { User } = require('../models');

// Clear test database before running tests
beforeEach(async () => {
  await User.destroy({ where: {} }); // Clear all users in the database
});

describe('User Registration and Login', () => {
  
  it('should register a tech-admin successfully', async () => {
    const res = await request(app)
      .post('/register/tech-admin')
      .send({
        name: 'Tech Admin',
        email: 'techadmin@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.message).toEqual('Tech-admin registered successfully');
  });

  it('should prevent registering multiple tech-admins', async () => {
    // Register first tech-admin
    await request(app)
      .post('/register/tech-admin')
      .send({
        name: 'Tech Admin',
        email: 'techadmin@example.com',
        password: 'password123'
      });
    
    // Attempt to register another tech-admin
    const res = await request(app)
      .post('/register/tech-admin')
      .send({
        name: 'Another Tech Admin',
        email: 'another@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Tech-admin already exists');
  });

  it('should login a tech-admin successfully', async () => {
    // First, register the tech-admin
    await request(app)
      .post('/register/tech-admin')
      .send({
        name: 'Tech Admin',
        email: 'techadmin@example.com',
        password: 'password123'
      });

    // Then, attempt to login
    const res = await request(app)
      .post('/login/tech-admin')
      .send({
        email: 'techadmin@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toEqual('Tech-admin login successful');
  });
  
  // Additional tests for admin and student registration, login can be added similarly

});

