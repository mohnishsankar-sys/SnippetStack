const express = require('express');
const router = express.Router();
const {
  getSnippets,
  getSnippetStats,
  getSnippetById,
  createSnippet,
  updateSnippet,
  toggleFavorite,
  deleteSnippet,
} = require('../controllers/snippetController');

// Stats endpoint must be defined BEFORE /:id route
router.get('/stats', getSnippetStats);

// List and Create
router.route('/')
  .get(getSnippets)
  .post(createSnippet);

// Toggle Favorite
router.patch('/:id/favorite', toggleFavorite);

// Single Snippet Operations (Read, Update, Delete)
router.route('/:id')
  .get(getSnippetById)
  .put(updateSnippet)
  .delete(deleteSnippet);

module.exports = router;
