# allow both GET and POST requests
from flask import Flask, request, render_template
import numpy as np

from keras.models import load_model
from skimage.transform import resize
from keras.preprocessing import image
from keras.applications.resnet50 import preprocess_input


app = Flask(__name__)
new_model = load_model('ASL.h5')

def predict(frame):
    print("Predicting")
    # img = resize(frame, (64, 64, 3))
    img_array = image.img_to_array(frame)
    img_batch = np.expand_dims(img_array, axis=0)
    img_preprocessed = preprocess_input(img_batch)
    prediction = new_model.predict(img_preprocessed)
    print(prediction)

@app.route('/form-example', methods=['GET', 'POST'])
def form_example():
    if request.method == 'POST':  # this block is only entered when the form is submitted
        json = request.get_json()
        print(json['string'])
    return "A"

@app.route('/', methods=['GET'])
def landing_page():
    img_path = "test images/Y Test.jpg"
    img = image.load_img(img_path, target_size=(64,64)) # resize image
    print(predict(img))
    return send_from_directory("static", "public")

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')
