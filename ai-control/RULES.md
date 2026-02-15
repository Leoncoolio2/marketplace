# AI Development Rules – V1 LOCKED

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
