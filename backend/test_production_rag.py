import requests

BASE_URL = "https://rag-a-muffin.onrender.com"

def test_production_rag():
    print(f"🧐 Testing RAG on PRODUCTION: {BASE_URL}...")
    try:
        payload = {
            "message": "Tell me about the headphones",
            "session_id": "prod_test_1"
        }
        r = requests.post(f"{BASE_URL}/api/chat", json=payload, timeout=30)
        
        if r.status_code == 200:
            data = r.json()
            print("✅ RAG Response received!")
            print(f"🤖 Assistant: {data['answer']}")
            print(f"📚 Sources: {[s['source'] for s in data.get('sources', [])]}")
        else:
            print(f"❌ Failed with status {r.status_code}: {r.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_production_rag()
