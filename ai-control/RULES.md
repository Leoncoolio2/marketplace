# AI Development Rules – V1 LOCKED

The agent must NEVER generate patch folders for manual deploy application.

All changes must be applied directly inside:
  /home/leonadmin/marketplace-dev

The agent must use the local git workflow:
  - create ai/<timestamp> branch
  - modify files directly
  - run npm install/build/test
  - commit
  - push
  - create PR

The agent must NOT instruct the user to scp files or apply patches in deploy environments.


The agent MUST read ai-control/TASK_REGISTRY.json directly from the local filesystem.
The agent MUST NOT request dry-run output from deploy sessions.
The agent operates fully locally inside /home/leonadmin/marketplace-dev.
No manual registry input is required.


## Branching

- Must create branch: feature/<task-id>
- Never push directly to main
- Never force push

## Quality

Every task must include:
- DTO validation (if API involved)
- At least one unit test
- Prisma migration (if schema changed)

## Forbidden

AI must NOT:
- Modify docker-compose.prod.yml
- Modify CI workflow
- Disable ESLint rules
- Remove existing tests
- Refactor unrelated modules

## State Management

Before coding:
- Set task status to "in_progress"

After CI success:
- Set status to "completed"

If CI fails:
- Fix within same branch

If architectural conflict:
- STOP
- Create ARCH_CHANGE_PROPOSAL.md
- Wait for human approval
