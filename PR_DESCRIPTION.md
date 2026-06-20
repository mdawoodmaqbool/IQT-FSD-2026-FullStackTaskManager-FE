# Migrate frontend to GraphQL with Apollo Client

## Summary

This PR connects the TaskManager frontend to the backend **GraphQL API** using **Apollo Client**, replacing REST `fetch` calls. It adds server-side status filtering, cache optimizations, and optimistic UI for task creation.

## Changes

### GraphQL integration
- **Apollo Client** configured with cache policies
- **operations.ts** — queries (`GetTasks`, `GetTaskCounts`) and CRUD mutations
- **ApolloProvider** wraps the app via `AppProviders`

### Data hook
- Rewrote **useTasks** to use `useQuery` / `useMutation`
- Passes `status` filter to the server (no client-side filtering of full lists)
- Fetches filter counts from `taskCounts` query
- Optimistic response on task create

### UI
- **TaskBoard** uses server-filtered tasks and GraphQL counts
- Removed redundant client-side filter/count logic

### Config
- Added `NEXT_PUBLIC_GRAPHQL_URL` to `.env.example`

## Optimizations

| Technique | Benefit |
|-----------|---------|
| Server-side status filter | Less data over the network |
| `cache-and-network` | Fast UI with background refresh |
| Cache keyed by `status` | Separate cache per filter tab |
| Optimistic create | Instant feedback before server response |
| Dedicated counts query | Avoids loading all tasks for badge numbers |
| `refetchQueries` on mutations | Keeps counts in sync after CRUD |

## Environment

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Test plan

- [ ] Start backend with PostgreSQL and GraphQL enabled
- [ ] Run `npm install` and `npm run dev`
- [ ] Create a task and confirm it appears immediately
- [ ] Switch filter tabs and verify server-filtered results
- [ ] Confirm filter counts update after create/delete
- [ ] Edit task title, description, and status
- [ ] Delete a task and confirm list + counts refresh
- [ ] Run `npm run build` and `npm run lint`

## Notes

- REST client (`src/lib/api.ts`) kept for reference; UI uses GraphQL
- See local `DB_Connect_Features.md` for full-stack learning guide (not committed)
