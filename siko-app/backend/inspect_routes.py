from main import app

print(f"Total routes on app: {len(app.routes)}")
for r in app.routes:
    path = getattr(r, 'path', None)
    name = getattr(r, 'name', '')
    methods = getattr(r, 'methods', None)
    if path:
        print(f"  {methods} {path} ({name})")
    else:
        print(f"  [MOUNT] {name}")
