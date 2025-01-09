import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor as rf
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, explained_variance_score
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib  
import matplotlib.pyplot as plt

# Load the dataset (make sure the path is correct)
file_path = "/content/financial_news.csv"  # Ensure this path is correct
data = pd.read_csv(file_path)

if 'Summary' not in data.columns or 'Normalized Sentiment Score' not in data.columns:
    raise ValueError("The dataset must contain 'Summary' and 'Normalized Sentiment Score' columns.")

# Extract text and labels
documents = data['Summary'].astype(str).tolist()  # 'Summary' as text
labels = data['Normalized Sentiment Score'].astype(float).tolist()  # 'Normalized Sentiment Score' as labels

# Preprocessing function: further enhancements can be added here
def preprocess_text(text):
    text = text.lower()  # Make text lowercase
    text = ''.join([char for char in text if char.isalpha() or char.isspace()])  # Remove non-alphabetic characters
    return text

# Apply preprocessing to documents
processed_documents = [preprocess_text(doc) for doc in documents]

# Initialize TfidfVectorizer with updated n-gram range and more features
vectorizer = TfidfVectorizer(
    max_features=25000,  # Increase max features for richer vocabulary
    ngram_range=(1, 3),  # Use unigrams, bigrams, and trigrams
    stop_words=None,  # Don't remove stop words
    min_df=0.005,  # Include terms that appear in at least 0.5% of documents
    max_df=0.95,  # Ignore terms that appear in more than 95% of documents
    sublinear_tf=True  # Apply sublinear term frequency scaling
)

# Fit and transform the processed documents
X_tfidf = vectorizer.fit_transform(processed_documents)

# Optionally, save the updated vectorizer for later use
joblib.dump(vectorizer, '/content/improved_tfidf_vectorizer.pkl')

# Prepare the features and target
X = X_tfidf
y = np.array(labels)  # Ensure labels are numeric

# Train-test split (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert to float32 for compatibility with sklearn models
X_train = X_train.astype(np.float32)
X_test = X_test.astype(np.float32)
y_train = y_train.astype(np.float32)  # Convert y_train to numpy array and then cast
y_test = y_test.astype(np.float32)  # Convert y_test to numpy array and then cast

# RandomForestRegressor hyperparameters for RandomizedSearchCV
param_dist_rf = {
    'n_estimators': [100, 200, 300, 500],
    'max_depth': [None, 10, 20, 30, 50, 100],
    'min_samples_split': [2, 5, 10, 20],
    'min_samples_leaf': [1, 2, 5, 10],
    'max_features': [None, 'auto', 'sqrt', 'log2', 0.5, 0.7],
    'bootstrap': [True, False]
}

# Create RandomForestRegressor
model_rf = rf()

# Perform RandomizedSearchCV to tune hyperparameters
random_search_rf = RandomizedSearchCV(estimator=model_rf, param_distributions=param_dist_rf,
                                      n_iter=10, cv=3, verbose=1, n_jobs=-1, random_state=42)

# Fit the model
random_search_rf.fit(X_train, y_train)

# Best parameters found after fine-tuning
print(f"Best Parameters after Fine-Tuning: {random_search_rf.best_params_}")

# Use the best estimator to update the model
model_rf_final = random_search_rf.best_estimator_

# Predict on the test data
y_pred_rf = model_rf_final.predict(X_test)

# Calculate performance metrics
mse_rf = mean_squared_error(y_test, y_pred_rf)
rmse_rf = np.sqrt(mse_rf)
mae_rf = mean_absolute_error(y_test, y_pred_rf)
r2_rf = r2_score(y_test, y_pred_rf)
evs_rf = explained_variance_score(y_test, y_pred_rf)

# Display evaluation metrics
print(f'Random Forest - Mean Squared Error (MSE): {mse_rf}')
print(f'Random Forest - Root Mean Squared Error (RMSE): {rmse_rf}')
print(f'Random Forest - Mean Absolute Error (MAE): {mae_rf}')
print(f'Random Forest - R-squared (R²): {r2_rf}')
print(f'Random Forest - Explained Variance Score: {evs_rf}')

# Plotting residuals for Random Forest
residuals_rf = y_test - y_pred_rf
plt.scatter(y_pred_rf, residuals_rf)
plt.xlabel('Predicted Values (Random Forest)')
plt.ylabel('Residuals')
plt.title('Random Forest: Residuals vs Predicted')
plt.show()

# Save the fine-tuned model back to disk using joblib for better efficiency
joblib.dump(model_rf_final, 'random_forest_regressor_model_finetuned_with_summary_and_normalized_score.joblib')