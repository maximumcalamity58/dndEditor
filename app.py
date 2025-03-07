from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

# Ensure static files (JS, CSS, JSON) are served correctly
@app.route('/static/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)

if __name__ == "__main__":
    app.run(debug=True)
