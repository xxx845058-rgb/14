#!/usr/bin/env python3
"""
3D Tarot Backend API Test Suite
Tests all backend endpoints with realistic tarot data
"""

import requests
import json
import uuid
from datetime import datetime
import time

# Configuration
BASE_URL = "https://mystic-tarot-cards.preview.emergentagent.com/api"
TEST_SESSION_ID = f"test_session_{uuid.uuid4()}"

# Test data - realistic tarot cards
SAMPLE_CARDS = [
    {
        "id": 1,
        "name": "Шут",
        "arcana": "major",
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
        "keywords": ["новое начало", "спонтанность", "свобода"],
        "upright_meaning": "Новые начинания, спонтанность, свобода духа, чистый потенциал",
        "reversed_meaning": "Безрассудство, наивность, отсутствие планов, легкомыслие",
        "reversed": False,
        "position": "Настоящее"
    },
    {
        "id": 7,
        "name": "Влюбленные", 
        "arcana": "major",
        "image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center",
        "keywords": ["любовь", "выбор", "гармония"],
        "upright_meaning": "Любовь, партнерство, важный выбор, гармония отношений",
        "reversed_meaning": "Дисгармония, неправильный выбор, расставание, конфликт ценностей",
        "reversed": True,
        "position": "Будущее"
    },
    {
        "id": 9,
        "name": "Сила",
        "arcana": "major", 
        "image": "https://images.unsplash.com/photo-1532618793091-ec5fe9635fbd?w=400&h=600&fit=crop&crop=center",
        "keywords": ["внутренняя сила", "терпение", "сострадание"],
        "upright_meaning": "Внутренняя сила, терпение, сострадание, контроль над эмоциями",
        "reversed_meaning": "Слабость, неуверенность, злоупотребление силой, потеря контроля",
        "reversed": False,
        "position": "Прошлое"
    }
]

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*60}")
    print(f"TESTING: {test_name}")
    print(f"{'='*60}")

def print_result(success, message, details=None):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")
    if details:
        print(f"Details: {details}")

def test_health_check():
    """Test 1: Basic API health check at /api/health"""
    print_test_header("Health Check Endpoint")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok":
                print_result(True, "Health check passed", f"Response: {data}")
                return True
            else:
                print_result(False, "Health check returned wrong status", f"Response: {data}")
                return False
        else:
            print_result(False, f"Health check failed with status {response.status_code}", response.text)
            return False
            
    except Exception as e:
        print_result(False, "Health check request failed", str(e))
        return False

def test_random_cards():
    """Test 2: Random cards generation for different spread types"""
    print_test_header("Random Cards Generation")
    
    spread_types = [
        {"type": "single", "count": 1},
        {"type": "three", "count": 3}, 
        {"type": "love", "count": 5},
        {"type": "celtic", "count": 10}
    ]
    
    all_passed = True
    
    for spread in spread_types:
        try:
            payload = {
                "count": spread["count"],
                "spread_type": spread["type"]
            }
            
            response = requests.post(f"{BASE_URL}/cards/random", 
                                   json=payload, 
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                cards = data.get("cards", [])
                
                if len(cards) == spread["count"]:
                    # Validate card structure
                    valid_cards = True
                    for card in cards:
                        required_fields = ["id", "name", "arcana", "keywords", "upright_meaning", "reversed_meaning"]
                        if not all(field in card for field in required_fields):
                            valid_cards = False
                            break
                    
                    if valid_cards:
                        print_result(True, f"{spread['type']} spread ({spread['count']} cards)", 
                                   f"Generated {len(cards)} valid cards")
                    else:
                        print_result(False, f"{spread['type']} spread has invalid card structure", 
                                   f"Cards: {cards}")
                        all_passed = False
                else:
                    print_result(False, f"{spread['type']} spread returned wrong number of cards", 
                               f"Expected {spread['count']}, got {len(cards)}")
                    all_passed = False
            else:
                print_result(False, f"{spread['type']} spread failed with status {response.status_code}", 
                           response.text)
                all_passed = False
                
        except Exception as e:
            print_result(False, f"{spread['type']} spread request failed", str(e))
            all_passed = False
    
    return all_passed

def test_ai_reading_generation():
    """Test 3: AI reading generation with EMERGENT_LLM_KEY"""
    print_test_header("AI Reading Generation")
    
    test_cases = [
        {
            "spread_type": "three",
            "question": "Что меня ждет в карьере в ближайшие месяцы?",
            "cards": SAMPLE_CARDS
        },
        {
            "spread_type": "love", 
            "question": "Как развиваются мои отношения?",
            "cards": SAMPLE_CARDS[:2]
        },
        {
            "spread_type": "single",
            "question": None,  # Test without question
            "cards": [SAMPLE_CARDS[0]]
        }
    ]
    
    all_passed = True
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            response = requests.post(f"{BASE_URL}/reading/generate",
                                   json=test_case,
                                   timeout=30)  # AI calls may take longer
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                if "interpretation" in data and "advice" in data:
                    # Check that AI actually generated content (not empty)
                    if len(data["interpretation"]) > 50 and len(data["advice"]) > 20:
                        print_result(True, f"AI reading test case {i}", 
                                   f"Generated {len(data['interpretation'])} chars interpretation, {len(data['advice'])} chars advice")
                    else:
                        print_result(False, f"AI reading test case {i} - content too short", 
                                   f"Interpretation: {len(data['interpretation'])} chars, Advice: {len(data['advice'])} chars")
                        all_passed = False
                else:
                    print_result(False, f"AI reading test case {i} - missing required fields", 
                               f"Response: {data}")
                    all_passed = False
            else:
                print_result(False, f"AI reading test case {i} failed with status {response.status_code}", 
                           response.text)
                all_passed = False
                
        except Exception as e:
            print_result(False, f"AI reading test case {i} request failed", str(e))
            all_passed = False
    
    return all_passed

def test_reading_save():
    """Test 4: Reading saving functionality"""
    print_test_header("Reading Save")
    
    try:
        # First generate an AI reading to save
        ai_payload = {
            "spread_type": "three",
            "question": "Тестовый вопрос для сохранения",
            "cards": SAMPLE_CARDS
        }
        
        ai_response = requests.post(f"{BASE_URL}/reading/generate", 
                                  json=ai_payload, 
                                  timeout=30)
        
        if ai_response.status_code != 200:
            print_result(False, "Could not generate AI reading for save test", ai_response.text)
            return False
        
        ai_data = ai_response.json()
        
        # Now save the reading
        save_payload = {
            "spread_type": "three",
            "question": "Тестовый вопрос для сохранения",
            "cards": SAMPLE_CARDS,
            "interpretation": ai_data["interpretation"],
            "user_session": TEST_SESSION_ID
        }
        
        save_response = requests.post(f"{BASE_URL}/reading/save",
                                    json=save_payload,
                                    timeout=10)
        
        if save_response.status_code == 200:
            data = save_response.json()
            if "message" in data and "reading_id" in data:
                print_result(True, "Reading saved successfully", 
                           f"Message: {data['message']}, ID: {data['reading_id']}")
                return True
            else:
                print_result(False, "Save response missing required fields", f"Response: {data}")
                return False
        else:
            print_result(False, f"Reading save failed with status {save_response.status_code}", 
                       save_response.text)
            return False
            
    except Exception as e:
        print_result(False, "Reading save request failed", str(e))
        return False

def test_reading_history():
    """Test 5: Reading history retrieval"""
    print_test_header("Reading History")
    
    try:
        # Wait a moment to ensure the saved reading is available
        time.sleep(1)
        
        response = requests.get(f"{BASE_URL}/reading/history",
                              params={"session": TEST_SESSION_ID},
                              timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if "readings" in data:
                readings = data["readings"]
                if len(readings) > 0:
                    # Validate reading structure
                    reading = readings[0]
                    required_fields = ["id", "session_id", "spread_type", "cards", "interpretation", "created_at"]
                    
                    if all(field in reading for field in required_fields):
                        print_result(True, f"Reading history retrieved successfully", 
                                   f"Found {len(readings)} readings for session")
                        return True
                    else:
                        print_result(False, "Reading history has invalid structure", 
                                   f"Missing fields in: {reading}")
                        return False
                else:
                    print_result(False, "No readings found in history", 
                               f"Expected at least 1 reading for session {TEST_SESSION_ID}")
                    return False
            else:
                print_result(False, "History response missing 'readings' field", f"Response: {data}")
                return False
        else:
            print_result(False, f"Reading history failed with status {response.status_code}", 
                       response.text)
            return False
            
    except Exception as e:
        print_result(False, "Reading history request failed", str(e))
        return False

def run_all_tests():
    """Run all backend tests"""
    print(f"\n🔮 3D TAROT BACKEND API TEST SUITE")
    print(f"Testing against: {BASE_URL}")
    print(f"Test session: {TEST_SESSION_ID}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Random Cards Generation", test_random_cards), 
        ("AI Reading Generation", test_ai_reading_generation),
        ("Reading Save", test_reading_save),
        ("Reading History", test_reading_history)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print_result(False, f"{test_name} crashed", str(e))
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed. Backend needs attention.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)