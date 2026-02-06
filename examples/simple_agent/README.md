# Simple Agent Example

A minimal example of using `ai-semantic-memory` with LangGraph.

## Setup

1. Install the library:
   ```bash
   cd ../..
   pip install -e ".[dev]"
   ```

2. Set environment variables:
   ```bash
   export OPENAI_API_KEY="sk-..."
   export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
   ```

   For Neon.tech, your URL looks like:
   ```
   postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

3. Optional: Create a `.env` file with these values.

## Run

Interactive chat with memory:
```bash
python main.py
```

Quick memory operations demo:
```bash
python main.py demo
```

## What It Does

1. **Stores memories** - When you tell it facts about yourself, it extracts and stores them.
2. **Retrieves memories** - On each turn, it searches for relevant memories to include in context.
3. **Handles contradictions** - If you correct a fact, it creates a version chain (audit trail).

## Example Session

```
You: Hi, I'm Alice and I work at Acme Corp.
Agent: Nice to meet you, Alice! How can I help you today?

You: What do you know about me?
Agent: Based on my memories, I know that:
- Your name is Alice
- You work at Acme Corp

You: Actually, I just switched to TechCo.
Agent: Congratulations on the new role at TechCo! I've updated my records.

You: Where do I work?
Agent: You work at TechCo.
```

Behind the scenes, the "Acme Corp" memory wasn't deleted — it was superseded by the "TechCo" memory, creating an audit trail.
