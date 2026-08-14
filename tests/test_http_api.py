import json
from datetime import date
from http.client import HTTPConnection
import threading
import unittest

from apexquant.interfaces.http import MVPRequestHandler, create_server


class HttpApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.server = create_server("127.0.0.1", 0)
        MVPRequestHandler.state = MVPRequestHandler.state.__class__()
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.port = cls.server.server_address[1]

    @classmethod
    def tearDownClass(cls) -> None:
        cls.server.shutdown()
        cls.thread.join(timeout=2)
        cls.server.server_close()

    def request(self, method: str, path: str, payload: dict | None = None):
        connection = HTTPConnection("127.0.0.1", self.port, timeout=3)
        body = json.dumps(payload).encode() if payload is not None else None
        connection.request(method, path, body=body, headers={"Content-Type": "application/json"} if body else {})
        response = connection.getresponse()
        return response.status, response.getheader("Access-Control-Allow-Origin"), json.loads(response.read())

    def test_health_and_unknown_data_history(self):
        status, cors, payload = self.request("GET", "/api/health")
        self.assertEqual(status, 200)
        self.assertEqual(cors, "*")
        self.assertFalse(payload["data"]["realBroker"])
        status, _, payload = self.request("GET", "/api/data/versions?datasetId=missing")
        self.assertEqual(status, 200)
        self.assertEqual(payload["data"]["history"], [])

    def test_backtest_submission_returns_run_and_metrics(self):
        status, _, payload = self.request("POST", "/api/backtests", {"strategyVersion":"strategy_v1","dataVersion":"data_v1","costModelVersion":"cost_v1","randomSeed":7,"startDate":date(2025,1,1).isoformat(),"endDate":date(2025,12,31).isoformat(),"initialCapital":"100000","deterministicReturn":"0.1"})
        self.assertEqual(status, 201)
        self.assertTrue(payload["data"]["runId"].startswith("run_"))
        self.assertEqual(payload["data"]["metrics"]["ending_capital"], "110000.00")

    def test_invalid_body_uses_error_envelope(self):
        status, _, payload = self.request("POST", "/api/backtests", {"strategyVersion":"only"})
        self.assertEqual(status, 400)
        self.assertEqual(payload["error"]["code"], "MISSING_FIELD")
