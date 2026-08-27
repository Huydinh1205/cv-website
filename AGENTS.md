<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## DATA FILES: experience & projects

When Huy tells Claude about a new job or project and confirms to proceed, update these two files:

- **`data/experience.ts`** — new job entries go at the top of the array (most recent first)
- **`data/projects.ts`** — new project entries appended before the closing `];`

Also update the base CV at `~/Desktop/Home/job-application/dev_Huy/CV/Huy-CV-YYYY-MM-DD.md`.

Always confirm details with Huy before writing — never invent bullet points or metrics.
