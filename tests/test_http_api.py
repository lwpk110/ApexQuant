import unittest
from datetime import date

from fastapi.testclient import TestClient

from apexquant.interfaces.http import app, reset_state


class HttpApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def setUp(self) -> None:
        reset_state()

    def test_health_and_unknown_data_history(self):
        response = self.client.get("/api/health", headers={"Origin": "http://127.0.0.1:4173"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], "*")
        self.assertFalse(response.json()["data"]["realBroker"])
        response = self.client.get("/api/data/versions", params={"datasetId": "missing"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["history"], [])

    def test_openapi_and_not_found_envelope(self):
        self.assertEqual(self.client.get("/openapi.json").status_code, 200)
        response = self.client.get("/api/missing")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["error"]["code"], "NOT_FOUND")

    def test_backtest_submission_returns_run_and_metrics(self):
        response = self.client.post("/api/backtests", json={"strategyVersion": "strategy_v1", "dataVersion": "data_v1", "costModelVersion": "cost_v1", "randomSeed": 7, "startDate": date(2025, 1, 1).isoformat(), "endDate": date(2025, 12, 31).isoformat(), "initialCapital": "100000", "deterministicReturn": "0.1"})
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["data"]["runId"].startswith("run_"))
        self.assertEqual(response.json()["data"]["metrics"]["ending_capital"], "110000.00")

    def test_invalid_body_uses_validation_error_envelope(self):
        response = self.client.post("/api/backtests", json={"strategyVersion": "only"})
        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()["error"]["code"], "VALIDATION_ERROR")
