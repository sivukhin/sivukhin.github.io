from http.server import HTTPServer, SimpleHTTPRequestHandler

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == "__main__":
    server_address = ("", 8000)
    httpd = HTTPServer(server_address, CustomHandler)
    print("Serving on port 8000...")
    httpd.serve_forever()
