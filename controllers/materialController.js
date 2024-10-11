// controllers/materialController.js

const path = require('path');
const fs = require('fs');
const { CourseMaterial, Contribution } = require('../models');

// Handle course material uploads by admins
exports.uploadCourseMaterial = async (req, res) => {
  const { courseCode } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const fileSize =file.size;

    // Save file information to the database
    const newMaterial = await CourseMaterial.create({
      courseCode,
      level,
      category,
      filePath: path.join('uploads/materials', file.filename),
      originalName: file.originalname,
      fileSize
    });

    res.status(201).json({ message: 'Course material uploaded successfully', material: newMaterial });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading course material', error });
  }
};

// Handle student contributions
exports.uploadContribution = async (req, res) => {
  const { courseCode } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const fileSize = file.size;
    
    // Save file information to the database
    const newContribution = await Contribution.create({
      courseCode,
      level,
      category,
      filePath: path.join('uploads/materials', file.filename),
      originalName: file.originalname,
      fileSize,
      contributedBy: req.user.id
    });

    res.status(201).json({ message: 'Contribution uploaded successfully', contribution: newContribution });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading contribution', error });
  }
};

// Admin deletes a course material
exports.deleteCourseMaterial = async (req, res) => {
  const { id } = req.params; // Material ID
  try {
    const material = await CourseMaterial.findByPk(id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Delete the file from the filesystem
    fs.unlinkSync(material.filePath);

    // Remove from the database
    await material.destroy();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error });
  }
};

// Student deletes their own contribution
exports.deleteContribution = async (req, res) => {
  const { id } = req.params; // Contribution ID
  try {
    const contribution = await Contribution.findByPk(id);

    if (!contribution || contribution.contributedBy !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this contribution' });
    }

    // Delete the file from the filesystem
    fs.unlinkSync(contribution.filePath);

    // Remove from the database
    await contribution.destroy();

    res.status(200).json({ message: 'Contribution deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contribution', error });
  }
};

// Download course material or contribution
exports.downloadMaterial = async (req, res) => {
  const { id, type } = req.params; // Material or contribution ID, type: 'course' or 'contribution'

  try {
    let material;
    if (type === 'course') {
      material = await CourseMaterial.findByPk(id);
    } else if (type === 'contribution') {
      material = await Contribution.findByPk(id);
    }

    if (!material) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Increment download count
    material.downloads += 1;
    await material.save();

    // Send file for download
    res.download(material.filePath, material.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file', error });
  }
};

