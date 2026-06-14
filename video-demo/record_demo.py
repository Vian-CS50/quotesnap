#!/usr/bin/env python3
"""Start server, record demo, stop server."""

import subprocess
import time
import os

# Start server
server = subprocess.Popen(
    ["npx", "serve", "dist", "-l", "3000"],
    cwd="/Users/viankruger/quotesnap/frontend",
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
time.sleep(3)

# Check health
try:
    import urllib.request
    urllib.request.urlopen("http://localhost:3000", timeout=5)
    print("Server ready")
except:
    print("Server failed to start")
    server.terminate()
    exit(1)

# Record demo
os.chdir("/Users/viankruger/quotesnap/video-demo")
result = subprocess.run(["python3", "generate_demo_v2.py"], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print(result.stderr)

# Stop server
server.terminate()
server.wait()
print("Done")
