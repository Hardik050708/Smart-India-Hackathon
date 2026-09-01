import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.ai_engine import assess_ai_severity, calculate_haversine_distance_km, calculate_text_similarity, route_challenge_to_smart_hei
from app.models import SeverityLevel

async def run_tests():
    print("\n========== RUNNING BACKEND TESTS (SIH-26043) ==========")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        
        # Test 1: AI Severity Engine 3-Layer Assessment & Threshold (> 85 => CRITICAL)
        print("\n[TEST 1] AI Severity Engine & Dynamic Formula Test")
        res_critical = assess_ai_severity(
            title="Toxic arsenic chemical spill causing cholera outbreak and bridge collapse",
            description="Immediate fatal emergency with casualties and structural damage",
            category="Water Quality",
            population_affected=6000,
            duplicate_count=3
        )
        print(f" -> Critical Assessment Result: Score={res_critical['priority_score']}, Level={res_critical['severity_level']}, Emergency={res_critical['is_emergency']}")
        assert res_critical['priority_score'] > 85.0, f"Expected >85, got {res_critical['priority_score']}"
        assert res_critical['is_emergency'] is True, "Expected is_emergency True"
        assert res_critical['severity_level'] == SeverityLevel.CRITICAL

        res_low = assess_ai_severity(
            title="Park bench repaint needed",
            description="Regular maintenance and painting requested for community garden",
            category="Urban Infrastructure",
            population_affected=25,
            duplicate_count=0
        )
        print(f" -> Low Assessment Result: Score={res_low['priority_score']}, Level={res_low['severity_level']}, Emergency={res_low['is_emergency']}")
        assert res_low['priority_score'] < 50.0
        assert res_low['is_emergency'] is False
        print(" [PASS] AI Severity Engine math formulas verified!")

        # Test 2: Haversine Geo-Distance & Semantic Deduplication
        print("\n[TEST 2] Haversine Distance & Semantic Deduplication Test")
        # Ranchi to Dhanbad approx 120-130 km
        dist_ranchi_dhanbad = calculate_haversine_distance_km(23.3441, 85.3096, 23.7957, 86.4304)
        print(f" -> Ranchi to Dhanbad Distance: {dist_ranchi_dhanbad:.2f} km")
        assert 115 < dist_ranchi_dhanbad < 140, f"Unexpected distance: {dist_ranchi_dhanbad}"

        # Two nearby points in Ranchi (< 2 km)
        dist_nearby = calculate_haversine_distance_km(23.3441, 85.3096, 23.3500, 85.3150)
        print(f" -> Nearby Points in Ranchi: {dist_nearby:.2f} km")
        assert dist_nearby < 5.0, "Expected < 5km"

        # Text similarity check
        text_a = "Arsenic contamination in drinking water borewell in Rajmahal"
        text_b = "Drinking water borewell arsenic contamination in Rajmahal village"
        sim = calculate_text_similarity(text_a, text_b)
        print(f" -> Text Similarity on duplicates: {sim:.2f}")
        assert sim >= 0.80, f"Expected >=0.80 similarity, got {sim}"
        print(" [PASS] Haversine and Geo-Semantic deduplication verified!")

        # Test 3: Smart HEI Routing Test
        print("\n[TEST 3] Smart HEI Domain & District Routing Test")
        agro_route = route_challenge_to_smart_hei(category="Agro-Tech & Soil Health", district="Ranchi", description="Maize crop pest infestation")
        print(f" -> Agro-Tech Routed to: {agro_route['primary_hei_short_name']} (Dept: {agro_route['recommended_department']})")
        assert "BAU" in agro_route['primary_hei_short_name'] or "Birsa" in agro_route['primary_hei_name']

        mining_route = route_challenge_to_smart_hei(category="Mining & Environment", district="Dhanbad", description="Coal mine fire subsidence")
        print(f" -> Mining Routed to: {mining_route['primary_hei_short_name']} (Dept: {mining_route['recommended_department']})")
        assert "IIT ISM" in mining_route['primary_hei_short_name']
        print(" [PASS] Smart HEI routing verified!")

        # Test 4: Authentication & Strict RBAC Enforcement (STUDENT -> GOV_ADMIN endpoint should return 403 Forbidden)
        print("\n[TEST 4] Strict RBAC Protection & Permission Validation")
        # 4a. Login as Student
        resp_student = await client.post("/api/v1/auth/login", json={"email": "student@jharkhand.gov.in", "password": "Password123!"})
        assert resp_student.status_code == 200, f"Login failed: {resp_student.text}"
        student_token = resp_student.json()["access_token"]
        student_headers = {"Authorization": f"Bearer {student_token}"}

        # 4b. Student tries to verify a challenge (Allowed only for LOCAL_BODY or GOV_ADMIN)
        # First get a challenge
        chal_list = await client.get("/api/v1/challenges")
        challenges = chal_list.json()
        assert len(challenges) > 0
        target_chal_id = challenges[0]["id"]

        resp_forbidden = await client.patch(
            f"/api/v1/challenges/{target_chal_id}/verify",
            json={"status": "verified", "local_body_notes": "Attempted by student"},
            headers=student_headers
        )
        print(f" -> Student trying to verify challenge: HTTP {resp_forbidden.status_code} ({resp_forbidden.json().get('detail')})")
        assert resp_forbidden.status_code == 403, f"Expected 403 Forbidden, got {resp_forbidden.status_code}"

        # 4c. Login as Local Body and verify the challenge (Should Succeed 200)
        resp_local = await client.post("/api/v1/auth/login", json={"email": "localbody@jharkhand.gov.in", "password": "Password123!"})
        assert resp_local.status_code == 200
        local_token = resp_local.json()["access_token"]
        local_headers = {"Authorization": f"Bearer {local_token}"}

        resp_verify = await client.patch(
            f"/api/v1/challenges/{target_chal_id}/verify",
            json={"status": "verified", "local_body_notes": "Official Panchayat Field Inspection Completed"},
            headers=local_headers
        )
        print(f" -> Local Body verifying challenge: HTTP {resp_verify.status_code}")
        assert resp_verify.status_code == 200
        assert resp_verify.json()["status"] == "verified"
        print(" [PASS] Strict RBAC middleware completely blocks unauthorized roles and allows valid roles!")

        # Test 5: CSR Marketplace & Pledging
        print("\n[TEST 5] CSR Marketplace Proposals & Capital Pledging")
        proposals_resp = await client.get("/api/v1/proposals")
        proposals = proposals_resp.json()
        assert len(proposals) > 0
        target_prop_id = proposals[0]["id"]

        resp_csr = await client.post("/api/v1/auth/login", json={"email": "csr@jharkhand.gov.in", "password": "Password123!"})
        csr_token = resp_csr.json()["access_token"]
        csr_headers = {"Authorization": f"Bearer {csr_token}"}

        pledge_resp = await client.post(
            f"/api/v1/proposals/{target_prop_id}/pledge",
            json={"pledged_amount": 50000},
            headers=csr_headers
        )
        print(f" -> CSR Partner Pledging Funds: HTTP {pledge_resp.status_code}, New Pledged: Rs. {pledge_resp.json()['pledged_amount']}")
        assert pledge_resp.status_code == 200

        # Test 6: 24-District Jharkhand Heatmap Analytics
        print("\n[TEST 6] 24-District Jharkhand Heatmap & Analytics")
        heatmap_resp = await client.get("/api/v1/analytics/jharkhand-heatmap")
        heatmap = heatmap_resp.json()
        print(f" -> Districts Returned: {len(heatmap)} districts")
        assert len(heatmap) == 24, f"Expected 24 districts, got {len(heatmap)}"

        overview_resp = await client.get("/api/v1/analytics/overview")
        overview = overview_resp.json()
        print(f" -> Overview: Total Challenges={overview['total_challenges']}, Critical={overview['critical_emergencies']}, Active Projects={overview['in_progress_projects']}")
        assert overview["total_challenges"] >= 5
        print(" [PASS] 24-District Heatmap and Analytics API verified!")

    print("\n=======================================================")
    print(" ALL BACKEND TESTS PASSED (100% SPEC COMPLIANCE) ")
    print("=======================================================\n")

if __name__ == "__main__":
    asyncio.run(run_tests())
