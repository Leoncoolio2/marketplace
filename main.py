import yaml
from core.agent import MarketplaceAgent
from memory.memory import Memory

with open("config/agent.yaml") as f:
    config = yaml.safe_load(f)

memory = Memory()
agent = MarketplaceAgent(config, memory)
agent.run()
