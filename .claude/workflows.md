# Claude Workflows for Social MCP Project

## Selective Git Commit Workflow

### Usage
When you need to commit only specific files/changes while ignoring others:

1. **Stage only the specified files**:
   ```bash
   git add <specific-file1> <specific-file2>
   ```

2. **Create descriptive commit with proper format**:
   ```bash
   git commit -m "$(cat <<'EOF'
   <Short descriptive title (50 chars max)>
   
   <Detailed description of changes>
   - Bullet point 1
   - Bullet point 2
   - Bullet point 3
   EOF
   )"
   ```

3. **Push to current branch**:
   ```bash
   git push
   ```

### Example: Commit only PLAN.md changes
```bash
# Stage only PLAN.md (ignore src/, other files)
git add PLAN.md

# Commit with descriptive message
git commit -m "$(cat <<'EOF'
Update PLAN.md with revised project structure

- Separate tools from resources in MCP implementation
- Update Phase 1 scope to 7 tools and 4 resources  
- Clarify Phase 2 additions for social features
EOF
)"

# Push changes
git push
```

### Key Principles
- **Explicit file staging**: Only `git add` the files you want to commit
- **Descriptive commits**: Use imperative mood, clear bullet points
- **Ignore untracked/modified files**: Let other files remain uncommitted
- **Consistent format**: Follow project's commit message conventions

### Common Patterns
```bash
# Documentation only
git add README.md PLAN.md docs/
git commit -m "Update documentation for Phase 1 implementation"

# Configuration only  
git add package.json tsconfig.json .eslintrc.json
git commit -m "Update TypeScript and linting configuration"

# Source code only (specific files)
git add src/index.ts src/tools/post.ts
git commit -m "Implement core MCP server and post tools"
```

### Safety Checks
1. Always run `git status` first to see what's changed
2. Use `git diff --cached` to review staged changes before commit
3. Verify only intended files are staged with `git status` again
4. Use descriptive commit messages that explain the "why", not just "what"