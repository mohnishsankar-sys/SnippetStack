const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Snippet = require('../models/Snippet');
const connectDB = require('../config/db');

const sampleSnippets = [
  {
    title: 'Python List Comprehension with Conditional Filtering',
    description: 'Transform and filter list elements cleanly in a single readable line with Python list comprehension.',
    contentType: 'code',
    language: 'Python',
    category: 'Algorithms & Data Structures',
    content: `# Extract squares of even numbers from a list
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

even_squares = [x**2 for x in numbers if x % 2 == 0]
print(f"Original numbers: {numbers}")
print(f"Squares of even numbers: {even_squares}")
# Output: [4, 16, 36, 64, 100]

# Nested transformation: Flatten a 2D matrix
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [item for row in matrix for item in row]
print(f"Flattened matrix: {flattened}")
# Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]`,
    tags: ['python', 'list-comprehension', 'data-structures', 'clean-code'],
    isFavorite: true,
  },
  {
    title: 'JavaScript Modern Array Pipeline (Filter, Map, Reduce)',
    description: 'Functional programming pattern in ES6+ for processing data collections with chaining.',
    contentType: 'code',
    language: 'JavaScript',
    category: 'Web Development',
    content: `// Sample collection of e-commerce line items
const orders = [
  { id: 101, product: 'Wireless Mouse', price: 29.99, quantity: 2, inStock: true },
  { id: 102, product: 'Mechanical Keyboard', price: 119.50, quantity: 1, inStock: true },
  { id: 103, product: 'USB-C Cable', price: 12.00, quantity: 0, inStock: false },
  { id: 104, product: '4K Monitor', price: 349.00, quantity: 1, inStock: true },
];

// Chain filter, map, and reduce to compute total value of in-stock items
const invoiceSummary = orders
  .filter(item => item.inStock && item.quantity > 0)
  .map(item => ({
    name: item.product,
    subtotal: +(item.price * item.quantity).toFixed(2)
  }))
  .reduce(
    (acc, item) => {
      acc.items.push(item);
      acc.totalCost += item.subtotal;
      return acc;
    },
    { items: [], totalCost: 0 }
  );

console.log('Processed Order Summary:', JSON.stringify(invoiceSummary, null, 2));`,
    tags: ['javascript', 'es6', 'functional-programming', 'arrays', 'web-dev'],
    isFavorite: true,
  },
  {
    title: 'SQL Complex Aggregation with JOIN and GROUP BY',
    description: 'Calculate customer lifetime revenue and order frequency using relational JOINs and windowing aggregations.',
    contentType: 'code',
    language: 'SQL',
    category: 'Database',
    content: `-- Retrieve top high-value customers with lifetime spend and order counts
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email,
    COUNT(o.order_id) AS total_orders,
    ROUND(SUM(o.total_amount), 2) AS lifetime_spent,
    MAX(o.order_date) AS last_order_date,
    CASE 
        WHEN SUM(o.total_amount) >= 1000 THEN 'VIP'
        WHEN SUM(o.total_amount) >= 500 THEN 'Gold'
        ELSE 'Standard'
    END AS customer_tier
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_status = 'COMPLETED'
GROUP BY c.customer_id, c.first_name, c.last_name, c.email
HAVING COUNT(o.order_id) >= 2
ORDER BY lifetime_spent DESC
LIMIT 10;`,
    tags: ['sql', 'database', 'aggregates', 'joins', 'analytics'],
    isFavorite: false,
  },
  {
    title: 'MongoDB Multi-Stage Aggregation Pipeline',
    description: 'Advanced Mongoose/MongoDB pipeline with $match, $group, $sort, and $project for dashboard metrics.',
    contentType: 'code',
    language: 'JavaScript',
    category: 'Database',
    content: `// MongoDB Aggregation Pipeline in Node.js / Mongoose
const getDashboardMetrics = async (startDate, endDate) => {
  return await db.collection('transactions').aggregate([
    // Stage 1: Filter transactions within specified date range and status
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    // Stage 2: Group by department and compute totals
    {
      $group: {
        _id: '$department',
        totalRevenue: { $sum: '$amount' },
        averageTicket: { $avg: '$amount' },
        transactionCount: { $sum: 1 },
        topItems: { $addToSet: '$category' }
      }
    },
    // Stage 3: Project formatted output
    {
      $project: {
        _id: 0,
        department: '$_id',
        totalRevenue: { $round: ['$totalRevenue', 2] },
        averageTicket: { $round: ['$averageTicket', 2] },
        transactionCount: 1,
        categoriesServed: { $size: '$topItems' }
      }
    },
    // Stage 4: Order by highest revenue
    {
      $sort: { totalRevenue: -1 }
    }
  ]).toArray();
};`,
    tags: ['mongodb', 'nosql', 'mongoose', 'aggregation-pipeline', 'database'],
    isFavorite: true,
  },
  {
    title: 'Git Essential Branching, Stash & Interactive Rebase',
    description: 'Key terminal commands for clean Git workflow, temporary work saving, and commit history squashing.',
    contentType: 'command',
    language: 'Bash',
    category: 'DevOps',
    content: `# 1. Create and switch to a new feature branch
git checkout -b feature/auth-system

# 2. Temporarily stash uncommitted changes with a descriptive label
git stash push -m "Work in progress: jwt middleware"
git stash list
# Restore stashed changes later:
git stash pop

# 3. Cleanly interactive rebase last 3 commits to squash before pull request
git rebase -i HEAD~3

# 4. Sync feature branch with main without creating messy merge commits
git fetch origin
git rebase origin/main

# 5. Undo last commit while keeping modified files staged in index
git reset --soft HEAD~1

# 6. Check detailed compact graph view of branches
git log --oneline --graph --decorate --all`,
    tags: ['git', 'devops', 'cli', 'version-control', 'bash'],
    isFavorite: false,
  },
  {
    title: 'AI Coding Prompt: Production Code Refactoring & Security Audit',
    description: 'A battle-tested structured system prompt to analyze code for edge cases, performance, security, and TypeScript typing.',
    contentType: 'prompt',
    language: 'Plain Text',
    category: 'AI & Machine Learning',
    content: `You are a Principal Software Architect and Security Auditor reviewing production code.

Analyze the code provided below according to these criteria:
1. **Architecture & SOLID Principles**: Is the code modular, cohesive, and easy to maintain?
2. **Security Vulnerabilities**: Check for injection risks, unsanitized inputs, prototype pollution, IDOR, or token leaks.
3. **Performance & Complexity**: Identify any O(N^2) loops, memory leaks, or unoptimized database/network queries.
4. **Resilience & Edge Cases**: What happens on null/undefined, empty arrays, timeout errors, or unexpected payloads?
5. **Modern Idiomatic Refactor**: Provide a rewritten version adhering to clean code standards and best practices.

FORMAT YOUR RESPONSE AS FOLLOWS:
- **Executive Summary**: 2-3 sentences summarizing overall quality.
- **Identified Issues Table**: Columns for Severity [High/Med/Low], Location, Risk, Recommended Fix.
- **Refactored Code**: Complete, copy-paste ready implementation with comments explaining major improvements.
- **Unit Test Recommendations**: Key scenarios to cover with test suites.

[INSERT YOUR CODE SNIPPET HERE]`,
    tags: ['ai-prompt', 'refactoring', 'code-review', 'security', 'productivity'],
    isFavorite: true,
  },
];

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Checking for existing sample snippets...');
    let insertedCount = 0;
    let existingCount = 0;

    for (const sample of sampleSnippets) {
      // Check if snippet with exact same title already exists
      const existing = await Snippet.findOne({ title: sample.title });
      if (existing) {
        existingCount++;
        console.log(`[Seed] Kept existing snippet: "${sample.title}"`);
      } else {
        await Snippet.create(sample);
        insertedCount++;
        console.log(`[Seed] Inserted new snippet: "${sample.title}"`);
      }
    }

    console.log(`\n===========================================`);
    console.log(`[Seed] Seeding completed successfully!`);
    console.log(`[Seed] Newly inserted snippets: ${insertedCount}`);
    console.log(`[Seed] Existing preserved snippets: ${existingCount}`);
    console.log(`[Seed] Database: "snippetstack"`);
    console.log(`[Seed] Collection: "snippets"`);
    console.log(`===========================================\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
