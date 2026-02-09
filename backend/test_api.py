import requests
import time

BASE_URL = "http://localhost:8000"

def test_health():
    print("\n🩺 Testing Health Endpoint...")
    try:
        r = requests.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "healthy"
        print("✅ Health check passed!")
    except Exception as e:
        print(f"❌ Health check failed: {e}")

def test_seed_data():
    print("\n🌱 Testing Seed Data...")
    try:
        r = requests.post(f"{BASE_URL}/api/admin/seed-sample-data")
        assert r.status_code == 200
        print(f"✅ Seeded: {r.json()['items_added']} items")
    except Exception as e:
        print(f"❌ Seed data failed: {e}")

def test_document_stats():
    print("\n📊 Testing Document Stats...")
    try:
        r = requests.get(f"{BASE_URL}/api/documents/stats")
        assert r.status_code == 200
        print(f"✅ Total documents: {r.json()['total_documents']}")
    except Exception as e:
        print(f"❌ Document stats failed: {e}")

def test_chat():
    print("\n💬 Testing Chat Endpoint...")
    try:
        payload = {"message": "Do you have wireless headphones?", "session_id": "test_123"}
        r = requests.post(f"{BASE_URL}/api/chat", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "answer" in data
        print(f"✅ Got answer: {data['answer'][:100]}...")
        print(f"   Sources: {len(data.get('sources', []))}")
    except Exception as e:
        print(f"❌ Chat failed: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("🧪 Running API Integration Tests")
    print("=" * 50)
    
    test_health()
    test_seed_data()
    test_document_stats()
    test_chat()
    
    print("\n" + "=" * 50)
    print("Test run complete")
    print("=" * 50)
