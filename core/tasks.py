from dataclasses import dataclass

@dataclass
class Task:
    title: str
    description: str
    status: str = "planned"
    result: str | None = None
