# allow both GET and POST requests
from flask import Flask, request, render_template, url_for
from flask_cors import CORS, cross_origin
import numpy as np
import os
import tensorflow as tf
from keras.models import load_model
from skimage.transform import resize
from keras.preprocessing import image
from keras.applications.resnet50 import preprocess_input
from PIL import Image
import base64
from io import BytesIO
# Imports the Google Cloud client library
from google.cloud import storage

placeholder = 0

app = Flask(__name__, template_folder='templates')
CORS(app)
new_model = load_model('ASL.h5')

def convert_label(x):
    if x == 0:
        return 'A'
    elif x == 1:
        return 'B'
    elif x == 2:
        return 'C'
    elif x == 3:
        return 'D'
    elif x == 4:
        return 'E'
    elif x == 5:
        return 'F'
    elif x == 6:
        return 'G'
    elif x == 7:
        return 'H'
    elif x == 8:
        return 'I'
    elif x == 9:
        return 'J'
    elif x == 10:
        return 'K'
    elif x == 11:
        return 'L'
    elif x == 12:
        return 'M'
    elif x == 13:
        return 'N'
    elif x == 14:
        return 'O'
    elif x == 15:
        return 'P'
    elif x == 16:
        return 'Q'
    elif x == 17:
        return 'R'
    elif x == 18:
        return 'S'
    elif x == 19:
        return 'T'
    elif x == 20:
        return 'U'
    elif x == 21:
        return 'V'
    elif x == 22:
       return 'W'
    elif x == 23:
        return 'X'
    elif x == 24:
        return 'Y'
    elif x == 25:
        return 'Z'

@app.route('/form-example', methods=['GET', 'POST'])
def form_example():
    if request.method == 'POST':  # this block is only entered when the form is submitted
        json = request.get_json()
        base64_string = json['baseurl']
        print(base64_string)
        imgdata = base64.b64decode(str(base64_string))
        img = Image.open(BytesIO(imgdata))
        img = img.resize((64,64))
        img_array = image.img_to_array(img)
        img_batch = np.expand_dims(img_array, axis=0)
        img_preprocessed = preprocess_input(img_batch)
        prediction = new_model.predict(img_preprocessed)
        label = convert_label(np.argmax(prediction[0]))
        print(label)
        filename = "{}.png".format(label)
        temp_location ='/tmp/' + filename
        print(temp_location)

        with open(temp_location, "wb") as f:        
            f.write(imgdata)

        # Instantiates a client
        client = storage.Client.from_service_account_json(os.path.abspath('asl-image-recognition-06bf33fe04df.json'))
        # The name for the new bucket
        bucket_name = "asl-image-recognition.appspot.com"
        bucket = client.get_bucket(bucket_name)
        blob = bucket.blob(filename)
        blob.upload_from_filename(temp_location)

        return label


@app.route('/', methods=['GET'])
def index():
    img_path = "test images/Y Test.jpg"
 
    return render_template("index.html")

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                 endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)

if __name__ == '__main__':
    app.run(debug=True)




