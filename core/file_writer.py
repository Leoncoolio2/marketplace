from pathlib import Path

class FileWriter:
    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir)

    def write(self, relative_path: str, content: str):
        file_path = self.base_dir / relative_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")
        return str(file_path)
