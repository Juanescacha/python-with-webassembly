from flask import Flask, render_template

# creamos la aplicacion web
app = Flask(__name__)

#definimos la ruta principal
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)