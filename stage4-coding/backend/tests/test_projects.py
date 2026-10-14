import os

import pytest
from flask_jwt_extended import create_access_token
from postgrest.exceptions import APIError

os.environ.setdefault("JWT_SECRET_KEY", "test-secret-with-enough-length-1234567890")

from app import create_app  # noqa: E402
from app.services import project_service  # noqa: E402


class FakeResult:
    def __init__(self, data):
        self.data = data


class FakeTable:
    def __init__(self, fake):
        self.fake = fake

    def insert(self, row):
        self.fake.inserted.append(row)
        return self

    def execute(self):
        if self.fake.error:
            raise self.fake.error
        row = {"id": "44444444-4444-4444-4444-444444444444", "is_completed": False}
        row.update(self.fake.inserted[-1])
        return FakeResult([row])


class FakeSupabase:
    def __init__(self, error=None):
        self.error = error
        self.inserted = []

    def table(self, name):
        assert name == "projects"
        return FakeTable(self)


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    return app.test_client(), app


def auth(app):
    with app.app_context():
        return {"Authorization": "Bearer " + create_access_token(identity="test-user")}


def test_requires_token(client):
    c, _ = client
    res = c.post("/api/projects", json={"project_name": "Spring launch"})
    assert res.status_code == 401
    assert "error" in res.get_json()


def test_empty_name_returns_400(client, monkeypatch):
    c, app = client
    monkeypatch.setattr(project_service, "get_supabase", lambda: FakeSupabase())
    res = c.post("/api/projects", json={"project_name": "   "}, headers=auth(app))
    assert res.status_code == 400
    assert res.get_json()["error"] == "Project name is required"


def test_missing_name_returns_400(client, monkeypatch):
    c, app = client
    monkeypatch.setattr(project_service, "get_supabase", lambda: FakeSupabase())
    res = c.post("/api/projects", json={}, headers=auth(app))
    assert res.status_code == 400


def test_too_long_name_returns_400(client, monkeypatch):
    c, app = client
    monkeypatch.setattr(project_service, "get_supabase", lambda: FakeSupabase())
    res = c.post("/api/projects", json={"project_name": "x" * 101}, headers=auth(app))
    assert res.status_code == 400


def test_project_created(client, monkeypatch):
    c, app = client
    fake = FakeSupabase()
    monkeypatch.setattr(project_service, "get_supabase", lambda: fake)
    res = c.post(
        "/api/projects",
        json={"project_name": "  Spring launch ", "description": "Q2 plan"},
        headers=auth(app),
    )
    assert res.status_code == 201
    body = res.get_json()
    assert body["project_name"] == "Spring launch"  # trimmed
    assert body["description"] == "Q2 plan"
    assert fake.inserted[0] == {"project_name": "Spring launch", "description": "Q2 plan"}


def test_description_is_optional(client, monkeypatch):
    c, app = client
    fake = FakeSupabase()
    monkeypatch.setattr(project_service, "get_supabase", lambda: fake)
    res = c.post("/api/projects", json={"project_name": "No desc"}, headers=auth(app))
    assert res.status_code == 201
    assert fake.inserted[0]["description"] is None


def test_database_error_returns_500(client, monkeypatch):
    c, app = client
    err = APIError({"message": "boom", "code": "XX000", "details": None, "hint": None})
    monkeypatch.setattr(project_service, "get_supabase", lambda: FakeSupabase(error=err))
    res = c.post("/api/projects", json={"project_name": "Spring launch"}, headers=auth(app))
    assert res.status_code == 500
    assert res.get_json() == {"error": "Database error"}
