import json
from datetime import datetime, timezone
from pathlib import Path


DATA_FILE = Path(__file__).with_name("todos.data.json")


def _load_items() -> list[dict]:
    if not DATA_FILE.exists():
        return []

    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def _save_items(items: list[dict]) -> None:
    DATA_FILE.write_text(json.dumps(items, indent=2), encoding="utf-8")


def _next_id(items: list[dict]) -> int:
    return max((int(item.get("id", 0)) for item in items), default=0) + 1


def list_action(_: dict) -> dict:
    items = _load_items()
    return {"success": True, "data": {"items": items}, "error": ""}


def create_action(inputs: dict) -> dict:
    title = str(inputs.get("title", "")).strip()
    if not title:
        return {"success": False, "data": None, "error": "title is required"}

    items = _load_items()
    item = {
        "id": _next_id(items),
        "title": title,
        "done": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    items.append(item)
    _save_items(items)
    return {"success": True, "data": {"item": item}, "error": ""}


def toggle_action(inputs: dict) -> dict:
    try:
        todo_id = int(inputs.get("id"))
    except (TypeError, ValueError):
        return {"success": False, "data": None, "error": "id is required"}

    items = _load_items()
    for item in items:
        if int(item.get("id", 0)) == todo_id:
            item["done"] = not bool(item.get("done"))
            _save_items(items)
            return {"success": True, "data": {"item": item}, "error": ""}

    return {"success": False, "data": None, "error": f"Todo {todo_id} not found"}


def delete_action(inputs: dict) -> dict:
    try:
        todo_id = int(inputs.get("id"))
    except (TypeError, ValueError):
        return {"success": False, "data": None, "error": "id is required"}

    items = _load_items()
    filtered = [item for item in items if int(item.get("id", 0)) != todo_id]
    if len(filtered) == len(items):
        return {"success": False, "data": None, "error": f"Todo {todo_id} not found"}

    _save_items(filtered)
    return {"success": True, "data": {"deletedId": todo_id}, "error": ""}


def handle(action_name: str, inputs: dict) -> dict:
    actions = {
        "list": list_action,
        "create": create_action,
        "toggle": toggle_action,
        "delete": delete_action,
    }

    action = actions.get(action_name)
    if action is None:
        return {"success": False, "data": None, "error": f"Unknown action: {action_name}"}

    return action(inputs)
