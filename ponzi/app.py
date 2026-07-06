from flask import Flask, request, redirect, send_from_directory, abort
import os

app = Flask(__name__, static_folder='.', static_url_path='')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def file_path(filename: str) -> str:
    # Serve only files that exist in the project root
    return os.path.join(BASE_DIR, filename)


@app.route('/', defaults={'path': 'Home.html'})
@app.route('/<path:path>')
def serve(path):
    # Clean routes
    if request.method == 'GET' and path == 'register':
        return redirect('/register.html', code=302)
    if request.method == 'GET' and path == 'signup':
        return redirect('/signup.html', code=302)

    # Form handlers
    if request.method == 'POST' and path == 'signup':
        # Read expected fields (even though we don't persist data)
        full_name = request.form.get('fullname', '')
        email = request.form.get('email', '')
        password = request.form.get('password', '')
        # You can add persistence later; for now we just redirect.
        return redirect('/dashboard.html', code=302)

    if request.method == 'POST' and path == 'login':
        email = request.form.get('email', '')
        password = request.form.get('password', '')
        return redirect('/dashboard.html', code=302)

    # Static files from repo root
    # Allow direct requests to *.html
    # Also allow existing files like dashboard.html etc.
    candidate = os.path.basename(path)
    full = file_path(candidate)
    if os.path.isfile(full):
        return send_from_directory(BASE_DIR, candidate)

    abort(404)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '3000'))
    app.run(host='0.0.0.0', port=port, debug=False)

