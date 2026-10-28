"""Tests for the Kanban endpoints. They use a fake in-memory database, so no Supabase is needed.

Run from the backend/ folder:   python -m pytest tests/test_board.py
"""
import os
import unittest
from unittest.mock import patch

# app.extensions creates the Supabase clients when it is imported, so give it dummy values first
FAKE_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.dummy"
os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", FAKE_KEY)
os.environ.setdefault("SUPABASE_SERVICE_KEY", FAKE_KEY)

from flask import Flask  # noqa: E402

from app.api.board import board_bp  # noqa: E402
from app.api.tasks import tasks_bp  # noqa: E402
from app.utils.errors import register_error_handlers  # noqa: E402

ALICE, BOB = "aaaaaaaa-0000-0000-0000-000000000001", "bbbbbbbb-0000-0000-0000-000000000002"
TEAM1, TEAM2 = "11111111-0000-0000-0000-000000000001", "22222222-0000-0000-0000-000000000002"
P1, P_DONE, P_OTHER = (
    "c1111111-0000-0000-0000-000000000001",
    "c2222222-0000-0000-0000-000000000002",
    "c3333333-0000-0000-0000-000000000003",
)


def task(n, project, title, stage, status, position):
    return {
        "id": f"d0000000-0000-0000-0000-{n:012d}", "project_id": project, "title": title,
        "stage": stage, "current_status": status, "position": position, "created_at": n,
    }


class Result:
    def __init__(self, data):
        self.data = data


class FakeQuery:
    def __init__(self, tables, name):
        self.tables, self.name = tables, name
        self.filters, self.orders, self.max, self.patch = [], [], None, None

    def select(self, *_):
        return self

    def eq(self, col, val):
        self.filters.append((col, val))
        return self

    def order(self, col):
        self.orders.append(col)
        return self

    def limit(self, n):
        self.max = n
        return self

    def update(self, values):
        self.patch = values
        return self

    def execute(self):
        rows = [r for r in self.tables[self.name] if all(r.get(c) == v for c, v in self.filters)]
        if self.patch is not None:
            for r in rows:
                r.update(self.patch)
        for col in reversed(self.orders):
            rows.sort(key=lambda r: r.get(col, 0))
        if self.max is not None:
            rows = rows[: self.max]
        return Result([dict(r) for r in rows])


class FakeDB:
    def __init__(self):
        self.tables = {
            "team_members": [
                {"id": "m1", "team_id": TEAM1, "user_id": ALICE},
                {"id": "m2", "team_id": TEAM2, "user_id": BOB},
            ],
            "projects": [
                {"id": P1, "project_name": "Portfolio", "is_completed": False, "team_id": TEAM1},
                {"id": P_DONE, "project_name": "Old one", "is_completed": True, "team_id": TEAM1},
                {"id": P_OTHER, "project_name": "Bob's", "is_completed": False, "team_id": TEAM2},
            ],
            "tasks": [
                task(1, P1, "Design schema", "DATABASE", "DONE", 1),
                task(2, P1, "Login route", "BACKEND", "IN_PROGRESS", 2),
                task(3, P1, "Board route", "BACKEND", "TO_DO", 3),
                task(4, P1, "Signup page", "FRONTEND", "TO_DO", 4),
                task(5, P_DONE, "Finished task", "BACKEND", "DONE", 1),
                task(6, P_OTHER, "Bob's task", "BACKEND", "TO_DO", 1),
            ],
        }

    def table(self, name):
        return FakeQuery(self.tables, name)


class FakeAnonClient:
    """Pretends to be Supabase auth: token 'alice' / 'bob' -> that user."""
    USERS = {"alice": ALICE, "bob": BOB}

    class _Auth:
        def get_user(self, token):
            if token not in FakeAnonClient.USERS:
                raise Exception("bad token")
            user = type("U", (), {"id": FakeAnonClient.USERS[token]})()
            return type("R", (), {"user": user})()

    auth = _Auth()


class KanbanApiTest(unittest.TestCase):
    def setUp(self):
        self.db = FakeDB()
        patches = [
            patch("app.extensions.admin_client", self.db),
            patch("app.middleware.auth.get_anon_client", lambda: FakeAnonClient()),
        ]
        for p in patches:
            p.start()
            self.addCleanup(p.stop)

        app = Flask(__name__)
        register_error_handlers(app)
        app.register_blueprint(board_bp)
        app.register_blueprint(tasks_bp)
        self.client = app.test_client()

    def get(self, url, user="alice"):
        return self.client.get(url, headers={"Authorization": f"Bearer {user}"})

    def patch_status(self, task_id, status, user="alice"):
        return self.client.patch(
            f"/api/v1/tasks/{task_id}/status",
            json={"status": status},
            headers={"Authorization": f"Bearer {user}"},
        )

    # ---------- GET board ----------
    def test_board_requires_token(self):
        res = self.client.get(f"/api/v1/projects/{P1}/board")
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.get_json()["error"]["code"], "UNAUTHORIZED")

    def test_board_groups_only_this_projects_tasks(self):
        res = self.get(f"/api/v1/projects/{P1}/board")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()["data"]
        self.assertEqual(data["project"]["name"], "Portfolio")
        self.assertIsNone(data["active_stage"])
        # JSON objects have no guaranteed order (Flask sorts keys), so compare as a set
        self.assertEqual(set(data["columns"]), {"TO_DO", "IN_PROGRESS", "TESTING_REVIEW", "DONE"})
        self.assertEqual([t["title"] for t in data["columns"]["TO_DO"]], ["Board route", "Signup page"])
        self.assertEqual([t["title"] for t in data["columns"]["DONE"]], ["Design schema"])
        self.assertEqual(data["progress"], {"done": 1, "total": 4, "percent": 25})
        all_titles = [t["title"] for col in data["columns"].values() for t in col]
        self.assertNotIn("Bob's task", all_titles)
        self.assertNotIn("Finished task", all_titles)

    def test_board_stage_filter_keeps_overall_progress(self):
        data = self.get(f"/api/v1/projects/{P1}/board?stage=backend").get_json()["data"]
        self.assertEqual(data["active_stage"], "BACKEND")
        titles = [t["title"] for col in data["columns"].values() for t in col]
        self.assertEqual(sorted(titles), ["Board route", "Login route"])
        self.assertEqual(data["progress"]["total"], 4)
        self.assertEqual(data["stage_progress"]["DATABASE"], {"done": 1, "total": 1, "percent": 100})

    def test_board_invalid_stage(self):
        res = self.get(f"/api/v1/projects/{P1}/board?stage=MOBILE")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.get_json()["error"]["code"], "VALIDATION_ERROR")

    def test_board_non_member_gets_403(self):
        res = self.get(f"/api/v1/projects/{P1}/board", user="bob")
        self.assertEqual(res.status_code, 403)
        self.assertEqual(res.get_json()["error"]["code"], "NOT_PROJECT_MEMBER")

    def test_board_unknown_or_bad_project_gets_404(self):
        missing = "c9999999-0000-0000-0000-000000000009"
        self.assertEqual(self.get(f"/api/v1/projects/{missing}/board").status_code, 404)
        self.assertEqual(self.get("/api/v1/projects/not-a-uuid/board").status_code, 404)

    def test_empty_project_has_zero_percent(self):
        self.db.tables["tasks"] = []
        data = self.get(f"/api/v1/projects/{P1}/board").get_json()["data"]
        self.assertEqual(data["progress"], {"done": 0, "total": 0, "percent": 0})

    # ---------- GET upcoming ----------
    def test_upcoming_returns_todo_tasks_of_stage(self):
        res = self.get(f"/api/v1/projects/{P1}/stages/BACKEND/upcoming")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()["data"]
        self.assertEqual(data["stage"], "BACKEND")
        self.assertEqual([t["title"] for t in data["tasks"]], ["Board route"])

    # ---------- PATCH status ----------
    def test_status_update_saves_and_returns_progress(self):
        task_id = "d0000000-0000-0000-0000-000000000003"
        res = self.patch_status(task_id, "DONE")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()["data"]
        self.assertEqual(data["task"]["current_status"], "DONE")
        self.assertEqual(data["progress"], {"done": 2, "total": 4, "percent": 50})
        saved = next(t for t in self.db.tables["tasks"] if t["id"] == task_id)
        self.assertEqual(saved["current_status"], "DONE")

    def test_status_update_invalid_status(self):
        res = self.patch_status("d0000000-0000-0000-0000-000000000003", "FINISHED")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.get_json()["error"]["code"], "VALIDATION_ERROR")

    def test_status_update_missing_status(self):
        res = self.client.patch(
            "/api/v1/tasks/d0000000-0000-0000-0000-000000000003/status",
            json={}, headers={"Authorization": "Bearer alice"},
        )
        self.assertEqual(res.status_code, 400)

    def test_status_update_non_member_gets_403_and_nothing_changes(self):
        task_id = "d0000000-0000-0000-0000-000000000003"
        res = self.patch_status(task_id, "DONE", user="bob")
        self.assertEqual(res.status_code, 403)
        saved = next(t for t in self.db.tables["tasks"] if t["id"] == task_id)
        self.assertEqual(saved["current_status"], "TO_DO")

    def test_status_update_completed_project_gets_409(self):
        res = self.patch_status("d0000000-0000-0000-0000-000000000005", "TO_DO")
        self.assertEqual(res.status_code, 409)
        self.assertEqual(res.get_json()["error"]["code"], "PROJECT_COMPLETED")

    def test_status_update_unknown_task_gets_404(self):
        res = self.patch_status("d0000000-0000-0000-0000-000000000099", "DONE")
        self.assertEqual(res.status_code, 404)


if __name__ == "__main__":
    unittest.main()