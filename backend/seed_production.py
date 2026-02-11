import requests
import sys

BASE_URL = "https://rag-a-muffin.onrender.com"

def seed_production():
    print(f"🚀 Seeding PRODUCTION database at {BASE_URL}...")
    try:
        # 1. Health check
        print("🔍 Checking system status...")
        health = requests.get(f"{BASE_URL}/api/health", timeout=10)
        if health.status_code == 200:
            print(f"✅ System is online: {health.json()['status']}")
        else:
            print(f"⚠️ System health returned {health.status_code}")

        # 2. Seed Data
        print("🌱 Triggering seed-sample-data endpoint...")
        r = requests.post(f"{BASE_URL}/api/admin/seed-sample-data", timeout=30)
        if r.status_code == 200:
            print(f"✅ Success! Seeded {r.json().get('items_added')} sample items.")
        elif r.status_code == 405:
            print(f"❌ Method Not Allowed. check if /api/admin/seed-sample-data exists and accepts POST.")
        else:
            print(f"❌ Seed failed with status {r.status_code}: {r.text}")

        # 3. Verify Stats
        print("📊 Verifying document stats...")
        stats = requests.get(f"{BASE_URL}/api/documents/stats", timeout=10)
        if stats.status_code == 200:
            print(f"✅ Total documents now in ChromaDB: {stats.json().get('total_documents')}")
        
    except Exception as e:
        print(f"❌ Error communicating with production: {e}")

if __name__ == "__main__":
    seed_production()
