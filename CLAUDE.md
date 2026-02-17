# Softball Tryouts App - Claude Guidelines

## Production Status
This application is **IN PRODUCTION**. All code changes require extra attention and careful testing.

## Files

| File | Purpose | Notes |
|------|---------|-------|
| `gc_softball_tryouts.html` | **Production** | Main app used for actual tryouts |
| `gc_softball_tryouts_demo.html` | **Demo** | Has demo player names for testing/demos |

## Critical Rules

### 1. TRYOUT_GROUPS Data is Frozen
Never modify the `TRYOUT_GROUPS` constant. The player names and group assignments must not change:
```javascript
const TRYOUT_GROUPS = {
    'A': ['Maggie', 'Sophia', 'Clara', ...],
    'B': ['Rebecca', 'Julia', 'MJ', ...],
    'C': ['Paige', 'Isabel', 'MDR', ...],
    'Pitchers': [...],
    'Catchers': [...]
};
```

### 2. Keep Files Separate
- Production changes go to `gc_softball_tryouts.html` only
- Demo file has its own demo player names - don't sync production names to demo
- Don't sync demo names to production

### 3. Player Data
- Player data is stored in localStorage and synced to Firestore
- Never modify or reset player scoring data without explicit user request

## Before Making Changes
1. Confirm the change is for production file
2. Verify TRYOUT_GROUPS will not be modified
3. Test thoroughly before committing
4. Use clear commit messages describing the change
