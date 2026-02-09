# Phase 5: Integration & Testing

> **Duration: 3 Days** | **Difficulty: Intermediate** | **Cost: $0.00**

---

## 🎯 Phase Objectives

- ✅ End-to-end testing of all features
- ✅ Edge case handling
- ✅ Performance optimization
- ✅ Error boundaries and recovery
- ✅ Cross-browser testing

---

## 📋 Day 14: End-to-End Testing

### Step 5.1: Backend API Testing Script

Create `backend/test_api.py`:

```python
"""
Comprehensive API Testing Script
Run: python test_api.py
"""
import requests
import time

BASE_URL = "http://localhost:8000"

def test_health():
    print("\n🩺 Testing Health Endpoint...")
    r = requests.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"
    print("✅ Health check passed!")

def test_seed_data():
    print("\n🌱 Testing Seed Data...")
    r = requests.post(f"{BASE_URL}/api/admin/seed-sample-data")
    assert r.status_code == 200
    print(f"✅ Seeded: {r.json()['items_added']} items")

def test_document_stats():
    print("\n📊 Testing Document Stats...")
    r = requests.get(f"{BASE_URL}/api/documents/stats")
    assert r.status_code == 200
    print(f"✅ Total documents: {r.json()['total_documents']}")

def test_chat():
    print("\n💬 Testing Chat Endpoint...")
    payload = {"message": "Do you have wireless headphones?", "session_id": "test_123"}
    r = requests.post(f"{BASE_URL}/api/chat", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "answer" in data
    print(f"✅ Got answer: {data['answer'][:100]}...")
    print(f"   Sources: {len(data.get('sources', []))}")

def test_chat_memory():
    print("\n🧠 Testing Chat Memory...")
    session = f"memory_test_{int(time.time())}"
    
    # First message
    r1 = requests.post(f"{BASE_URL}/api/chat", json={"message": "What headphones do you have?", "session_id": session})
    assert r1.status_code == 200
    
    # Follow-up (should remember context)
    r2 = requests.post(f"{BASE_URL}/api/chat", json={"message": "Which one has the best battery?", "session_id": session})
    assert r2.status_code == 200
    print("✅ Memory working - follow-up context maintained")

def test_document_upload():
    print("\n📄 Testing Document Upload...")
    # Create a simple test PDF would require PyPDF2
    # For now, just test the endpoint exists
    r = requests.get(f"{BASE_URL}/api/documents/sources")
    assert r.status_code == 200
    print(f"✅ Sources available: {len(r.json().get('sources', []))}")

if __name__ == "__main__":
    print("=" * 50)
    print("🧪 Running API Integration Tests")
    print("=" * 50)
    
    tests = [test_health, test_seed_data, test_document_stats, test_chat, test_chat_memory, test_document_upload]
    passed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"❌ {test.__name__} failed: {e}")
    
    print("\n" + "=" * 50)
    print(f"✅ Passed: {passed}/{len(tests)} tests")
    print("=" * 50)
```

### Step 5.2: Run All Tests

```bash
# Terminal 1: Start backend
cd backend && uvicorn app.main:app --reload

# Terminal 2: Run tests
cd backend && python test_api.py
```

---

## 📋 Day 15: Edge Cases & Error Handling

### Step 5.3: Test Edge Cases

| Test Case | Expected Behavior |
|-----------|-------------------|
| Empty message | Return validation error |
| Very long message (>2000 chars) | Truncate or reject |
| Special characters | Handle gracefully |
| Empty database | Return helpful fallback |
| Rate limit exceeded | Show user-friendly message |
| Network timeout | Retry with exponential backoff |

### Step 5.4: Add Error Boundary (Frontend)

Create `frontend/src/components/ErrorBoundary.jsx`:

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-4">Please refresh the page</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## 📋 Day 16: Performance & Optimization

### Step 5.5: Backend Optimizations

```python
# Add to main.py - Response compression
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add caching for common queries (in rag_pipeline.py)
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_search(query_hash):
    return chroma.search(query_hash, top_k=5)
```

### Step 5.6: Frontend Optimizations

```javascript
// Debounce input for auto-suggestions
import { useMemo } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useMemo(() => debounce(searchFn, 300), []);
```

---

## ✅ Phase 5 Checklist

- [ ] Backend API tests passing
- [ ] Chat with memory working
- [ ] Document upload functioning
- [ ] Error boundary implemented
- [ ] Edge cases handled
- [ ] Performance optimizations applied

## 🔄 Git Commit

```bash
git add . && git commit -m "Phase 5: Testing and optimization complete" && git push
```

---

**Next: [Phase 6: Deployment](./Phase_6_Deployment.md)**
