from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from io import BytesIO
from PIL import Image
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import pandas as pd

def preprocess_image(image_file, target_size=(299, 299)):
    image = Image.open(BytesIO(image_file.read()))
    image = image.resize(target_size)
    image_array = img_to_array(image)
    image_array = image_array.reshape((1,) + image_array.shape)
    
    datagen = ImageDataGenerator(rescale=1./255)
    processed_image = datagen.flow(image_array, batch_size=1)
    return next(processed_image)


def preprocess_data(age, hypertension, heart_disease, bmi, HbA1c_level, blood_glucose_level, gender, smoking_history):
    # Convert boolean fields to integers
    hypertension = 1 if hypertension else 0
    heart_disease = 1 if heart_disease else 0

    # One-hot encode gender
    gender_encoded = {'Male': [0, 1], 'Female': [1, 0]}.get(gender, [0, 0])  # Default to [0, 0] if unknown

    # One-hot encode smoking history
    smoking_history_encoded = {
        'No Info': [1, 0, 0, 0, 0, 0],
        'current': [0, 1, 0, 0, 0, 0],
        'ever': [0, 0, 1, 0, 0, 0],
        'former': [0, 0, 0, 1, 0, 0],
        'never': [0, 0, 0, 0, 1, 0],
        'not current': [0, 0, 0, 0, 0, 1]
    }.get(smoking_history, [0, 0, 0, 0, 0, 0])  # Default to all zeros if smoking history is unknown

    # Combine all features into a single array
    features = [age, hypertension, heart_disease, bmi, HbA1c_level, blood_glucose_level] + gender_encoded + smoking_history_encoded

    # Convert to DataFrame with appropriate feature names in the correct order
    feature_names = [
        'age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 'blood_glucose_level',
        'gender_Female', 'gender_Male',
        'smoking_history_No Info', 'smoking_history_current', 'smoking_history_ever', 
        'smoking_history_former', 'smoking_history_never', 'smoking_history_not current'
    ]
    features_df = pd.DataFrame([features], columns=feature_names)

    # Load the scaler used during training
    scaler = joblib.load('ML_model/scaler.pkl')
    features_scaled = scaler.transform(features_df)  # Use the scaler to transform the features

    return features_scaled