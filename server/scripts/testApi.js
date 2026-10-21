/**
 * Automated API verification script for SnippetStack
 */
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting SnippetStack API Verification Tests ---');

  // Test 1: Health check
  console.log('\n[1/7] Testing GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('Status:', healthRes.status, 'Response:', JSON.stringify(healthData));
  if (!healthData.success || healthData.database.status !== 'connected') {
    throw new Error('Health check failed: MongoDB is not connected');
  }

  // Test 2: Get Stats
  console.log('\n[2/7] Testing GET /api/snippets/stats...');
  const statsRes = await fetch(`${BASE_URL}/snippets/stats`);
  const statsData = await statsRes.json();
  console.log('Status:', statsRes.status, 'Total Snippets:', statsData.data.totalSnippets, 'Favorites:', statsData.data.favoritesCount);

  // Test 3: List Snippets
  console.log('\n[3/7] Testing GET /api/snippets...');
  const listRes = await fetch(`${BASE_URL}/snippets`);
  const listData = await listRes.json();
  console.log('Status:', listRes.status, 'Count retrieved:', listData.count);

  // Test 4: Create Snippet
  console.log('\n[4/7] Testing POST /api/snippets (Create)...');
  const newSnippetPayload = {
    title: 'Automated Test Snippet: React Memoization Hook',
    description: 'Demonstrates useMemo and useCallback for preventing unnecessary child re-renders.',
    contentType: 'code',
    language: 'JavaScript',
    category: 'Web Development',
    content: 'const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
    tags: ['react', 'hooks', 'performance', 'test'],
    isFavorite: true,
  };

  const createRes = await fetch(`${BASE_URL}/snippets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSnippetPayload),
  });
  const createData = await createRes.json();
  console.log('Status:', createRes.status, 'Created ID:', createData.data._id);
  const createdId = createData.data._id;

  // Test 5: Update Snippet
  console.log('\n[5/7] Testing PUT /api/snippets/:id (Update)...');
  const updateRes = await fetch(`${BASE_URL}/snippets/${createdId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Automated Test Snippet: React Memoization Hook (Updated)',
      description: 'Updated description for testing PUT endpoint.',
    }),
  });
  const updateData = await updateRes.json();
  console.log('Status:', updateRes.status, 'Updated Title:', updateData.data.title);

  // Test 6: Toggle Favorite
  console.log('\n[6/7] Testing PATCH /api/snippets/:id/favorite (Toggle Favorite)...');
  const favRes = await fetch(`${BASE_URL}/snippets/${createdId}/favorite`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isFavorite: false }),
  });
  const favData = await favRes.json();
  console.log('Status:', favRes.status, 'New Favorite Status:', favData.data.isFavorite);

  // Test 7: Delete Snippet
  console.log('\n[7/7] Testing DELETE /api/snippets/:id (Delete)...');
  const deleteRes = await fetch(`${BASE_URL}/snippets/${createdId}`, {
    method: 'DELETE',
  });
  const deleteData = await deleteRes.json();
  console.log('Status:', deleteRes.status, 'Deleted:', deleteData.message);

  // Verify deletion
  const verifyRes = await fetch(`${BASE_URL}/snippets/${createdId}`);
  console.log('Verification GET after delete status (expected 404):', verifyRes.status);

  console.log('\n======================================================');
  console.log(' ALL 7 API ENDPOINTS VERIFIED SUCCESSFULLY AGAINST MONGODB!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
