import os

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.dummy")
os.environ.setdefault("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.dummy")

import pytest  # noqa: E402

from app import create_app  # noqa: E402
from tests.fake_db import FakeDB  # noqa: E402

ALICE, BOB = "aaaaaaaa-0000-0000-0000-000000000001", "bbbbbbbb-0000-0000-0000-000000000002"


class FakeAnon:
    class _Auth:
        def get_user(self, token):
            users = {"alice": ALICE, "bob": BOB}
            if token not in users:
                raise Exception("bad token")
            user = type("U", (), {"id": users[token], "user_metadata": {"name": token.title()}})()
            return type("R", (), {"user": user})()

    auth = _Auth()


@pytest.fixture
def env(monkeypatch):
    db = FakeDB(teams=[], team_members=[], projects=[], tasks=[], project_templates=[])
    monkeypatch.setattr("app.extensions.admin_client", db)
    monkeypatch.setattr("app.middleware.auth.get_anon_client", lambda: FakeAnon())
    app = create_app()
    app.config["TESTING"] = True
    return db, app.test_client()


def post(client, body, user="alice"):
    return client.post("/api/v1/projects", json=body, headers={"Authorization": f"Bearer {user}"})


def dashboard(client, user="alice"):
    return client.get("/api/v1/dashboard", headers={"Authorization": f"Bearer {user}"})


def test_requires_token(env):
    _, client = env
    assert client.post("/api/v1/projects", json={"name": "x"}).status_code == 401
    assert client.get("/api/v1/dashboard").status_code == 401


@pytest.mark.parametrize("body", [{}, {"name": "   "}, {"name": "x" * 101}, {"name": "ok", "template_id": 7}])
def test_validation_errors_are_400(env, body):
    db, client = env
    res = post(client, body)
    assert res.status_code == 400
    assert db.tables["projects"] == []


def test_blank_project_makes_team_owner_and_project_without_tasks(env):
    db, client = env
    res = post(client, {"name": "  Portfolio ", "description": "Q4", "template_id": 0})
    assert res.status_code == 201
    data = res.get_json()["data"]
    assert data["name"] == "Portfolio"
    assert data["board_url"] == f"/projects/{data['id']}/board"
    assert db.tables["tasks"] == []
    member = db.tables["team_members"][0]
    assert member["user_id"] == ALICE and member["is_owner"] is True
    assert db.tables["projects"][0]["team_id"] == member["team_id"]


def test_starter_template_copies_tasks_into_the_project(env):
    db, client = env
    res = post(client, {"name": "With tasks", "template_id": 1})
    assert res.status_code == 201
    assert len(db.tables["tasks"]) == 18
    assert {t["project_id"] for t in db.tables["tasks"]} == {res.get_json()["data"]["id"]}
    assert {t["stage"] for t in db.tables["tasks"]} == {"DATABASE", "BACKEND", "FRONTEND"}
    assert all(t["description"] and t["note"] for t in db.tables["tasks"])
    assert any(t["resources"] for t in db.tables["tasks"])


def test_starter_template_is_read_from_the_database_when_present(env):
    db, client = env
    db.tables["project_templates"] = [{
        "id": "t1", "template_name": "Starter template",
        "default_tasks": [{"title": "Only task", "stage": "backend"}, {"title": "", "stage": "BACKEND"}],
    }]
    post(client, {"name": "X", "template_id": 1})
    assert [(t["title"], t["stage"]) for t in db.tables["tasks"]] == [("Only task", "BACKEND")]


def test_creator_can_open_the_new_board_right_away(env):
    _, client = env
    project_id = post(client, {"name": "Mine", "template_id": 1}).get_json()["data"]["id"]
    res = client.get(f"/api/v1/projects/{project_id}/board", headers={"Authorization": "Bearer alice"})
    assert res.status_code == 200
    assert res.get_json()["data"]["progress"] == {"done": 0, "total": 18, "percent": 0}
    other = client.get(f"/api/v1/projects/{project_id}/board", headers={"Authorization": "Bearer bob"})
    assert other.status_code == 403


def test_failure_in_the_middle_leaves_nothing_behind(env):
    db, client = env
    db.fail_on = {"tasks"}
    res = post(client, {"name": "Broken", "template_id": 1})
    assert res.status_code == 500
    assert res.get_json()["error"]["code"] == "DATABASE_ERROR"
    assert db.tables["teams"] == [] and db.tables["team_members"] == []
    assert db.tables["projects"] == [] and db.tables["tasks"] == []


def test_dashboard_lists_only_my_projects_with_progress(env):
    db, client = env
    mine = post(client, {"name": "Mine", "template_id": 1}).get_json()["data"]["id"]
    post(client, {"name": "Bob's", "template_id": 1}, user="bob")
    first = next(t for t in db.tables["tasks"] if t["project_id"] == mine)
    first["current_status"] = "DONE"

    data = dashboard(client).get_json()["data"]
    assert [p["name"] for p in data["projects"]] == ["Mine"]
    assert data["projects"][0]["progress"] == {"done": 1, "total": 18, "percent": 6}
    assert data["projects"][0]["board_url"] == f"/projects/{mine}/board"
    assert data["projects"][0]["project_id"] == mine
    assert "Alice" in data["summary_text"]


def test_dashboard_is_empty_for_a_new_user(env):
    _, client = env
    data = dashboard(client).get_json()["data"]
    assert data["projects"] == []