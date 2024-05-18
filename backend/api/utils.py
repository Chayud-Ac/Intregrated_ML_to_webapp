from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from io import BytesIO
from PIL import Image

def preprocess_image(image_file, target_size=(224, 224)):
    image = Image.open(BytesIO(image_file.read()))
    image = image.resize(target_size)
    image_array = img_to_array(image)
    image_array = image_array.reshape((1,) + image_array.shape)
    
    datagen = ImageDataGenerator(rescale=1./255)
    processed_image = datagen.flow(image_array, batch_size=1)
    return next(processed_image)
