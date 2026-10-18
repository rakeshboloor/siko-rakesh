from main import app

print("Checking routes on main app:")
for i, r in enumerate(app.routes):
    if hasattr(r, 'path'):
        print(f"[{i}] {getattr(r, 'methods', 'MOUNT')} {r.path}")
    elif hasattr(r, 'router'):
        print(f"[{i}] Router with {len(r.router.routes)} endpoints")
        for sub in r.router.routes[:2]:
            print(f"    - {getattr(sub, 'methods', '')} {getattr(sub, 'path', '')}")
    else:
        print(f"[{i}] {type(r).__name__}")
