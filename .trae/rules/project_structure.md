---
description: Project directory structure overview
alwaysApply: false
---

# Yaalp Project Structure

## Directory Structure

note: some files are not shown for simplicity.

```plaintext
sales-agent-app/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Elysia, ORPC)
```

### Key Characteristics

- **Type Safety**: End-to-end type safety via orpc and Drizzle ORM
- **Local/Remote Dual Mode**: PGLite enables user data

