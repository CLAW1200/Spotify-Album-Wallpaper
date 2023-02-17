import http.server
import socketserver
import webbrowser

PORT = 8000

# Open the default web browser
webbrowser.open_new_tab(f'http://localhost:{PORT}/index.html')

# Serve the current directory on the specified port
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving at http://localhost:{PORT}/")
httpd.serve_forever()
