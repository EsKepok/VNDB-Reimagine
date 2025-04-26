from flask import Flask, render_template
from api import vn_api

app = Flask(__name__)
app.register_blueprint(vn_api)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html', active_page='home')

@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html', active_page='about')

if __name__ == "__main__":
    app.run(debug=True)