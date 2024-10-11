// models/material.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Course Material Model
const CourseMaterial = sequelize.define('CourseMaterial', {
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING, // e.g., 'Level 100', 'Level 200'
    allowNull: false
  },
  category: {
    type: DataTypes.STRING, // e.g., 'Lecture Notes', 'Assignments', etc
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER, // Store the file size in bytes
    allowNull: false
  },
  uploadDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Contribution Model
const Contribution = sequelize.define('Contribution', {
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contributedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uploadDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = { CourseMaterial, Contribution };

