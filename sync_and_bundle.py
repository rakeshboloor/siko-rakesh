# -*- coding: utf-8 -*-
"""
Mirror modified views to siko-app/frontend/js/views/ and trigger rebundling
"""

import shutil, os, subprocess

SCRATCH = r"C:\Users\rakes\.gemini\antigravity\scratch"
SRC_VIEWS = os.path.join(SCRATCH, "siko-frontend", "js", "views")
DST_VIEWS = os.path.join(SCRATCH, "siko-app", "frontend", "js", "views")

files_to_sync = [
    "questionSynthesizer.js",
    "conceptTesting.js",
    "dynamicTimetableEngine.js",
    "studentHome.js",
    "parentDashboard.js",
    "studentOnboarding.js",
    "teacherDashboard.js",
    "adminDashboard.js",
    "bookingFlow.js",
    "teacherOnboarding.js",
    "publicWebsite.js",
    "ptmView.js"
]

for fname in files_to_sync:
    src = os.path.join(SRC_VIEWS, fname)
    dst = os.path.join(DST_VIEWS, fname)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {fname} -> siko-app/frontend/js/views/")
    else:
        print(f"WARNING: {src} not found!")

# Also sync core files state.js, app.js, components.js, and facultyPhotos.js
for core_f in ["state.js", "app.js", "components.js", "facultyPhotos.js"]:
    c_src = os.path.join(SCRATCH, "siko-frontend", "js", core_f)
    c_dst = os.path.join(SCRATCH, "siko-app", "frontend", "js", core_f)
    if os.path.exists(c_src):
        shutil.copy2(c_src, c_dst)
        print(f"Copied {core_f} -> siko-app/frontend/js/")

# Run bundle_v2.py
print("\nRunning bundle_v2.py...")
res = subprocess.run(["python", "bundle_v2.py"], cwd=SCRATCH, capture_output=True, text=True)
print(res.stdout)
if res.returncode != 0:
    print("Bundle error:", res.stderr)
else:
    # Copy to index.html and siko-version-a.html
    bundle_html = os.path.join(SCRATCH, "siko-bundle-v2.html")
    index_html = os.path.join(SCRATCH, "index.html")
    if os.path.exists(bundle_html):
        shutil.copy2(bundle_html, index_html)
        print(f"Successfully copied siko-bundle-v2.html -> index.html ({os.path.getsize(index_html)} bytes)")
