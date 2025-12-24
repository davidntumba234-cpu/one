#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class NeuronovaAPITester:
    def __init__(self, base_url="https://nova-services.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data}"
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, str(e))
            return False

    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root Endpoint", False, str(e))
            return False

    def test_get_services(self):
        """Test get services endpoint"""
        try:
            response = requests.get(f"{self.base_url}/services", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                services = response.json()
                if isinstance(services, list) and len(services) == 6:
                    # Check if all required services are present
                    service_ids = [s.get('id') for s in services]
                    expected_ids = ['web', 'ai', 'gadgets', 'security', 'design', 'coaching']
                    if all(sid in service_ids for sid in expected_ids):
                        details += f", Found {len(services)} services with correct IDs"
                    else:
                        success = False
                        details += f", Missing services. Found: {service_ids}"
                else:
                    success = False
                    details += f", Expected 6 services, got {len(services) if isinstance(services, list) else 'non-list'}"
            
            self.log_test("Get Services", success, details)
            return success
        except Exception as e:
            self.log_test("Get Services", False, str(e))
            return False

    def test_get_testimonials(self):
        """Test get testimonials endpoint"""
        try:
            response = requests.get(f"{self.base_url}/testimonials", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                testimonials = response.json()
                if isinstance(testimonials, list) and len(testimonials) >= 4:
                    # Check testimonial structure
                    first_testimonial = testimonials[0]
                    required_fields = ['id', 'name', 'company', 'content', 'rating']
                    if all(field in first_testimonial for field in required_fields):
                        details += f", Found {len(testimonials)} testimonials with correct structure"
                    else:
                        success = False
                        details += f", Missing fields in testimonial structure"
                else:
                    success = False
                    details += f", Expected at least 4 testimonials, got {len(testimonials) if isinstance(testimonials, list) else 'non-list'}"
            
            self.log_test("Get Testimonials", success, details)
            return success
        except Exception as e:
            self.log_test("Get Testimonials", False, str(e))
            return False

    def test_contact_form(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+243123456789",
            "message": "This is a test message from automated testing."
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/contact",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                if data.get('status') == 'success':
                    details += f", Message: {data.get('message', 'No message')}"
                else:
                    success = False
                    details += f", Unexpected response: {data}"
            
            self.log_test("Contact Form Submission", success, details)
            return success
        except Exception as e:
            self.log_test("Contact Form Submission", False, str(e))
            return False

    def test_quote_form(self):
        """Test quote form submission"""
        test_data = {
            "name": "Test Client",
            "email": "client@example.com",
            "service": "web",
            "message": "I need a website for my business. This is a test quote request."
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/quote",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                if data.get('status') == 'success':
                    details += f", Message: {data.get('message', 'No message')}"
                else:
                    success = False
                    details += f", Unexpected response: {data}"
            
            self.log_test("Quote Form Submission", success, details)
            return success
        except Exception as e:
            self.log_test("Quote Form Submission", False, str(e))
            return False

    def test_contact_form_validation(self):
        """Test contact form validation with missing fields"""
        test_data = {
            "name": "",  # Missing name
            "email": "invalid-email",  # Invalid email
            "message": ""  # Missing message
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/contact",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            # Should return 422 for validation error
            success = response.status_code == 422
            details = f"Status: {response.status_code} (expected 422 for validation error)"
            
            self.log_test("Contact Form Validation", success, details)
            return success
        except Exception as e:
            self.log_test("Contact Form Validation", False, str(e))
            return False

    def test_quote_form_validation(self):
        """Test quote form validation with missing fields"""
        test_data = {
            "name": "",  # Missing name
            "email": "invalid-email",  # Invalid email
            "service": "",  # Missing service
            "message": ""  # Missing message
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/quote",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            # Should return 422 for validation error
            success = response.status_code == 422
            details = f"Status: {response.status_code} (expected 422 for validation error)"
            
            self.log_test("Quote Form Validation", success, details)
            return success
        except Exception as e:
            self.log_test("Quote Form Validation", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Neuronova API Tests...")
        print(f"📡 Testing API at: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity tests
        self.test_health_check()
        self.test_root_endpoint()
        
        # Data retrieval tests
        self.test_get_services()
        self.test_get_testimonials()
        
        # Form submission tests
        self.test_contact_form()
        self.test_quote_form()
        
        # Validation tests
        self.test_contact_form_validation()
        self.test_quote_form_validation()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

    def get_test_summary(self):
        """Get test summary for reporting"""
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.tests_run - self.tests_passed,
            "success_rate": (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0,
            "test_results": self.test_results
        }

def main():
    tester = NeuronovaAPITester()
    exit_code = tester.run_all_tests()
    
    # Save detailed results
    summary = tester.get_test_summary()
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    return exit_code

if __name__ == "__main__":
    sys.exit(main())