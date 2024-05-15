from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def preprocess_image(image_file, target_size=(224, 224)):
    image = load_img(image_file, target_size=target_size)
    image_array = img_to_array(image)
    image_array = image_array.reshape((1,) + image_array.shape)
    
    # Assuming you have your ImageDataGenerator
    datagen = ImageDataGenerator(rescale=1./255)
    processed_image = datagen.flow(image_array, batch_size=1)
    return next(processed_image)
