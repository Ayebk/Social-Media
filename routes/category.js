const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const { getAllCategories,  createCategories,  getCategory, updateCategories, deleteCategories} = require('../controllers/category');

//gets all categorys
router.get('/all',getAllCategories)

//create a category
router.post('/',checkAuth,createCategories)

//gets a category
router.get('/',getCategory)

//update a category
router.patch('/',checkAuth,updateCategories)

//delete a category
router.delete('/',checkAuth,deleteCategories)

module.exports = router;