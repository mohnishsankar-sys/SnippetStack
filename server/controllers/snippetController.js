const Snippet = require('../models/Snippet');

/**
 * @desc    Get all snippets with filtering, search, and sorting
 * @route   GET /api/snippets
 */
exports.getSnippets = async (req, res, next) => {
  try {
    const {
      search,
      category,
      language,
      contentType,
      favorite,
      sortBy = 'newest',
    } = req.query;

    const filter = {};

    // Filter by category
    if (category && category !== 'All') {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Filter by language
    if (language && language !== 'All') {
      filter.language = { $regex: new RegExp(`^${language.trim()}$`, 'i') };
    }

    // Filter by contentType
    if (contentType && contentType !== 'All') {
      filter.contentType = contentType.toLowerCase();
    }

    // Filter by favorite status
    if (favorite === 'true' || favorite === true) {
      filter.isFavorite = true;
    } else if (favorite === 'false' || favorite === false) {
      filter.isFavorite = false;
    }

    // Multi-field search across title, description, content, tags, language, category
    if (search && search.trim()) {
      const sanitizedSearch = search.trim();
      const regex = new RegExp(sanitizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      filter.$or = [
        { title: regex },
        { description: regex },
        { content: regex },
        { tags: regex },
        { language: regex },
        { category: regex },
      ];
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 }; // default newest
    switch (sortBy) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'title-asc':
        sortOptions = { title: 1 };
        break;
      case 'title-desc':
        sortOptions = { title: -1 };
        break;
      case 'updated':
        sortOptions = { updatedAt: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const snippets = await Snippet.find(filter).sort(sortOptions).lean();

    res.status(200).json({
      success: true,
      count: snippets.length,
      data: snippets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dynamic snippet library statistics
 * @route   GET /api/snippets/stats
 */
exports.getSnippetStats = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalSnippets,
      distinctLanguages,
      favoritesCount,
      recentlyAddedCount,
      categoryCounts,
    ] = await Promise.all([
      Snippet.countDocuments(),
      Snippet.distinct('language'),
      Snippet.countDocuments({ isFavorite: true }),
      Snippet.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Snippet.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSnippets,
        languagesCount: distinctLanguages.length,
        favoritesCount,
        recentlyAddedCount,
        distinctLanguages,
        categoryCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single snippet by ID
 * @route   GET /api/snippets/:id
 */
exports.getSnippetById = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: `Snippet not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: snippet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new snippet
 * @route   POST /api/snippets
 */
exports.createSnippet = async (req, res, next) => {
  try {
    let {
      title,
      description,
      contentType,
      language,
      category,
      content,
      tags,
      isFavorite,
    } = req.body;

    // Validate essential fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Snippet title is required',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Snippet content (code or prompt) is required',
      });
    }

    // Process tags if passed as comma-separated string
    if (typeof tags === 'string') {
      tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const snippet = await Snippet.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      contentType: contentType || 'code',
      language: language ? language.trim() : 'Plain Text',
      category: category ? category.trim() : 'Web Development',
      content,
      tags: Array.isArray(tags) ? tags : [],
      isFavorite: Boolean(isFavorite),
    });

    res.status(201).json({
      success: true,
      message: 'Snippet created successfully',
      data: snippet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing snippet
 * @route   PUT /api/snippets/:id
 */
exports.updateSnippet = async (req, res, next) => {
  try {
    let {
      title,
      description,
      contentType,
      language,
      category,
      content,
      tags,
      isFavorite,
    } = req.body;

    // Process tags if passed as comma-separated string
    if (typeof tags === 'string') {
      tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (contentType !== undefined) updateData.contentType = contentType;
    if (language !== undefined) updateData.language = language.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (isFavorite !== undefined) updateData.isFavorite = Boolean(isFavorite);

    const snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: `Snippet not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Snippet updated successfully',
      data: snippet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle or set snippet favorite status
 * @route   PATCH /api/snippets/:id/favorite
 */
exports.toggleFavorite = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: `Snippet not found with id: ${req.params.id}`,
      });
    }

    // If explicit isFavorite provided, use it; otherwise toggle
    const newFavoriteStatus =
      req.body.isFavorite !== undefined
        ? Boolean(req.body.isFavorite)
        : !snippet.isFavorite;

    snippet.isFavorite = newFavoriteStatus;
    await snippet.save();

    res.status(200).json({
      success: true,
      message: `Snippet ${snippet.isFavorite ? 'marked as favorite' : 'removed from favorites'}`,
      data: snippet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a snippet
 * @route   DELETE /api/snippets/:id
 */
exports.deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findByIdAndDelete(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: `Snippet not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Snippet deleted successfully',
      data: { id: req.params.id, title: snippet.title },
    });
  } catch (error) {
    next(error);
  }
};
