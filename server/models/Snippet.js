const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Snippet title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    contentType: {
      type: String,
      enum: {
        values: ['code', 'prompt', 'command'],
        message: '{VALUE} is not a valid content type (must be code, prompt, or command)',
      },
      default: 'code',
      required: true,
    },
    language: {
      type: String,
      required: [true, 'Programming language or format is required'],
      trim: true,
      default: 'Plain Text',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Web Development',
    },
    content: {
      type: String,
      required: [true, 'Content (code or prompt) is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Clean up tags before saving: trim whitespace, filter empty, deduplicate
snippetSchema.pre('save', function (next) {
  if (Array.isArray(this.tags)) {
    this.tags = Array.from(
      new Set(
        this.tags
          .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
          .filter(Boolean)
      )
    );
  }
  next();
});

// Indexes for query performance and sorting
snippetSchema.index({ createdAt: -1 });
snippetSchema.index({ isFavorite: 1, createdAt: -1 });
snippetSchema.index({ category: 1 });
snippetSchema.index({ language: 1 });
snippetSchema.index({ contentType: 1 });
snippetSchema.index({ tags: 1 });

// Text index for full-text search capability
snippetSchema.index(
  {
    title: 'text',
    description: 'text',
    content: 'text',
    tags: 'text',
  },
  {
    weights: {
      title: 10,
      tags: 5,
      description: 3,
      content: 1,
    },
    name: 'snippet_text_search_index',
  }
);

const Snippet = mongoose.model('Snippet', snippetSchema, 'snippets');

module.exports = Snippet;
