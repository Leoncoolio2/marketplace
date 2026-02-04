import time
import os
from core.tasks import Task
from core.file_writer import FileWriter


class MarketplaceAgent:
    def __init__(self, config, memory):
        self.config = config
        self.memory = memory
        self.running = True

    # =================
    # TASK CREATION
    # =================

    def create_first_task(self):
        self.memory.set("phase", "readiness")

        task = Task(
            title="Run readiness check",
            description="Verify MVP components and generate readiness report"
        )
        self.memory.set("current_task", task)
        self.memory.set("first_task_created", True)

        print(f"✅ Task created: {task.title}")

    def plan_next_task(self):
        phase = self.memory.get("phase")

        if phase == "readiness":
            self.memory.set("phase", "done")
            print("🎉 READINESS CHECK COMPLETED")
            self.memory.set("current_task", None)
            return

    # =================
    # TASK EXECUTION
    # =================

    def execute_task(self, task: Task):
        print(f"⚙️ Executing task: {task.title}")

        checks = {
            "Auth API": "workspace/backend/api/auth.py",
            "Payments API": "workspace/backend/api/payments.py",
            "Escrow logic": "workspace/backend/domain/escrow.py",
            "DB models": "workspace/backend/db/models.py",
            "Flutter auth contract": "../flutter/auth_api.yaml",
            "Flutter payments contract": "../flutter/payments_api.yaml",
            "Git repository": "../.git"
        }

        results = {}
        all_ok = True

        for name, path in checks.items():
            exists = os.path.exists(path)
            results[name] = "OK" if exists else "MISSING"
            if not exists:
                all_ok = False

        report_lines = [
            "# MVP Readiness Report",
            "",
            "## Component Status",
            ""
        ]

        for name, status in results.items():
            report_lines.append(f"- **{name}**: {status}")

        report_lines.append("")
        report_lines.append("## Overall Status")
        report_lines.append("")

        if all_ok:
            report_lines.append("✅ **READY FOR LAUNCH**")
        else:
            report_lines.append("❌ **NOT READY – Missing components**")

        writer = FileWriter("workspace")
        writer.write(
            "readiness_report.md",
            "\n".join(report_lines)
        )

        task.status = "done"
        print("🧪 Readiness report generated")

    # =================
    # LOOP
    # =================

    def think(self):
        print("🧠 Agent thinking...")

        if not self.memory.get("first_task_created"):
            self.create_first_task()
            return

        task = self.memory.get("current_task")

        if task is None:
            print("✅ No remaining tasks. Agent idle.")
            return

        if task.status == "planned":
            self.execute_task(task)
            self.plan_next_task()

    def run(self):
        print("🚀 Marketplace agent started")
        while self.running:
            self.think()
            time.sleep(10)
