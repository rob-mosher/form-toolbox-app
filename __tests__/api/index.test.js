const request = require('supertest');
// const express = require('express');
const app = require('../../src/api');

describe('API server', () => {
  describe('GET /', () => {
    it('should respond with a 200 status code', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
    });
  });
});
