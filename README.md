# Intregrated_ML_to_webapp

" This project demonstrate web application of how we integrate machine learning model into web application using django and react"

## Setup Instructions

- **Conda**: Ensure you have Conda installed on your machine. You can download it from [Conda's official site](https://docs.conda.io/en/latest/miniconda.html).
- **Python**: Ensure you have Python installed (usually installed with Conda).

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/Intregrated_ML_to_webapp.git
cd Intregrated_ML_to_webapp
```

### 2. Create and activate conda environment using environment.yml (This provided all library using in this project)

```bash
conda env create -f environment.yml
conda activate fullstack  # Double check the name in environment.yml
```

### 3. Create a .env file This hold all important parameter that should be keep as secret (eg. database parameter , secret key)

```bash
Inside .env file

DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=patient_data
DB_USER=root
DB_PASSWORD=your_database_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

### 4. Apply Database Migrations ( cd BACKEND/)

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a Superuser ( cd BACKEND/)

```bash
python manage.py createsuperuser
```

### 6. Run the Development Server

```bash
python manage.py runserver
```
