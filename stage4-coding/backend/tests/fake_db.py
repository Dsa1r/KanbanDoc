"""A tiny in-memory stand-in for the Supabase client, shared by the tests."""
import copy
import uuid


class Result:
    def __init__(self, data):
        self.data = data


class FakeQuery:
    def __init__(self, db, name):
        self.db, self.name = db, name
        self.filters, self.orders = [], []
        self.max = None
        self.action, self.payload = "select", None
        self.columns = ""

    def select(self, columns="*"):
        self.columns = columns
        return self

    def eq(self, col, val):
        self.filters.append((col, lambda v, val=val: v == val))
        return self

    def in_(self, col, values):
        self.filters.append((col, lambda v, values=values: v in values))
        return self

    def order(self, col, desc=False):
        self.orders.append((col, desc))
        return self

    def limit(self, n):
        self.max = n
        return self

    def insert(self, payload):
        self.action, self.payload = "insert", payload
        return self

    def update(self, payload):
        self.action, self.payload = "update", payload
        return self

    def delete(self):
        self.action = "delete"
        return self

    def execute(self):
        if self.name in self.db.fail_on and self.action == "insert":
            raise RuntimeError(f"forced failure on {self.name}")
        table = self.db.tables.setdefault(self.name, [])

        if self.action == "insert":
            rows = self.payload if isinstance(self.payload, list) else [self.payload]
            created = []
            for row in rows:
                row = {"id": str(uuid.uuid4()), "created_at": self.db.tick(),
                       **self.db.DEFAULTS.get(self.name, {}), **row}
                table.append(row)
                created.append(row)
            return Result(copy.deepcopy(created))

        matched = [r for r in table if all(f(r.get(c)) for c, f in self.filters)]

        if self.action == "update":
            for r in matched:
                r.update(self.payload)
        elif self.action == "delete":
            self.db.delete_cascade(self.name, matched)
            return Result(copy.deepcopy(matched))

        for col, desc in reversed(self.orders):
            matched.sort(key=lambda r: r.get(col, 0), reverse=desc)
        if self.max is not None:
            matched = matched[: self.max]
        result = copy.deepcopy(matched)
        if self.name == "projects" and "tasks(" in self.columns:  # embedded select, like PostgREST
            for row in result:
                row["tasks"] = [
                    {"current_status": t["current_status"]}
                    for t in self.db.tables.get("tasks", []) if t["project_id"] == row["id"]
                ]
        return Result(result)


class FakeDB:
    """Knows the foreign keys that use ON DELETE CASCADE, like the real database."""

    # column defaults that the real database fills in
    DEFAULTS = {"tasks": {"current_status": "TO_DO", "position": 0}, "projects": {"is_completed": False}}
    CASCADES = {"teams": [("team_members", "team_id")], "projects": [("tasks", "project_id")]}

    def __init__(self, **tables):
        self.tables = {k: copy.deepcopy(v) for k, v in tables.items()}
        self.fail_on = set()
        self._clock = 0

    def tick(self):
        self._clock += 1
        return self._clock

    def table(self, name):
        return FakeQuery(self, name)

    def delete_cascade(self, name, rows):
        ids = {r["id"] for r in rows}
        self.tables[name] = [r for r in self.tables[name] if r["id"] not in ids]
        for child, col in self.CASCADES.get(name, []):
            self.tables[child] = [r for r in self.tables.get(child, []) if r.get(col) not in ids]