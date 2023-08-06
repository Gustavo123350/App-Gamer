from flask import Flask,render_template , request 
from flask_socketio import SocketIO, emit
from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('video_data')
def handle_video_data(data):
    emit('forward_video', data, broadcast=True)

@socketio.on('message')
def handle_message(message):
    print('Recevied message:', message)
    emit('message', message, broadcast=True)   

@app.route('/websocket')
def websocket():
    websocket = request.environ.get('wsgi.websokcet')

    if websocket:
        while True:
            message = websocket.receive()
            if message is not None:
                print('Received message:', message)
    else:
        raise ValueError('Error ao se conectar..')              
    

if __name__ == '__main__':
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
    socketio.run(app, debug=True)

