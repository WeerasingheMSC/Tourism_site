// src/controllers/packageController.js
import Package from '../models/Package.js';

/**
 * @desc    Add a new package
 * @route   POST /api/packages
 * @access  Admin
 */
export const addPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ message: 'Package created', package: pkg });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all packages
 * @route   GET /api/packages
 * @access  Public
 */
export const getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find();
    res.set('Cache-Control', 'no-store');
    res.json(packages);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single package by ID
 * @route   GET /api/packages/:id
 * @access  Public
 */
export const getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.set('Cache-Control', 'no-store');
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing package
 * @route   PUT /api/packages/:id
 * @access  Admin
 */
export const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json({ message: 'Package updated', package: pkg });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a package
 * @route   DELETE /api/packages/:id
 * @access  Admin
 */
export const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json({ message: 'Package deleted' });
  } catch (err) {
    next(err);
  }
};
