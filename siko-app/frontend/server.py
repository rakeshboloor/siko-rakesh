"""
SIKO LOCAL SERVER — Enhanced for development
Usage: python server.py [port]

Features:
- CORS headers for ES module imports
- Correct MIME types for JS modules
- Gzip support for CDN fallback
- Hot-reload friendly (no caching)
"""

import http.server
import socketserver
import sys
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000

class SIKOHandler(http.server.SimpleHTTPRequestHandler):
    """Enhanced HTTP handler with correct MIME types and CORS headers."""

    MIME_TYPES = {
        '.js':    'application/javascript',
        '.mjs':   'application/javascript',
        '.ts':    'application/javascript',
        '.css':   'text/css',
        '.html':  'text/html; charset=utf-8',
        '.json':  'application/json',
        '.svg':   'image/svg+xml',
        '.ico':   'image/x-icon',
        '.png':   'image/png',
        '.jpg':   'image/jpeg',
        '.jpeg':  'image/jpeg',
        '.gif':   'image/gif',
        '.woff2': 'font/woff2',
        '.woff':  'font/woff',
    }

    def end_headers(self):
        # Security + CORS for ES modules
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # No caching during development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        """Override to ensure correct MIME types for ES modules."""
        ext = os.path.splitext(path)[1].lower()
        if ext in self.MIME_TYPES:
            return self.MIME_TYPES[ext]
        return super().guess_type(path)

    def do_GET(self):
        """Serve index.html for SPA routes (client-side routing)."""
        # Check if file exists on disk
        filepath = self.translate_path(self.path)
        if not os.path.exists(filepath) or os.path.isdir(filepath):
            # SPA fallback: serve index.html
            if self.path != '/' and '.' not in os.path.basename(self.path):
                self.path = '/index.html'
        super().do_GET()

    def log_message(self, format, *args):
        """Colourised log output."""
        status = args[1] if len(args) > 1 else ''
        color = '\033[32m' if status == '200' else ('\033[33m' if status == '304' else '\033[31m')
        reset = '\033[0m'
        print(f"{color}[SIKO]{reset} {format % args}")


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with socketserver.TCPServer(('', PORT), SIKOHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"\n  SIKO Development Server")
        print(f"  =======================")
        print(f"  Local:   http://localhost:{PORT}")
        print(f"  Open this URL in your browser")
        print(f"  Press CTRL+C to stop\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\nServer stopped.")

