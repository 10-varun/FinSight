import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor as rf
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, explained_variance_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from scipy.sparse import hstack, csr_matrix
import joblib  
import matplotlib.pyplot as plt
import re
from collections import Counter

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

def extract_financial_keywords(documents, return_features=True, normalize=True):
    """
    Extract financial keywords and create numerical features from text documents.
    
    Parameters:
    -----------
    documents : list of str
        List of text documents to analyze
    return_features : bool, default=True
        If True, returns numerical feature matrix. If False, returns keyword counts only.
    normalize : bool, default=True
        If True, normalizes features using StandardScaler
    
    Returns:
    --------
    If return_features=True:
        feature_matrix : numpy array
            Numerical features for each document
        feature_names : list
            Names of the features
        keyword_stats : dict
            Statistics about keyword usage
    If return_features=False:
        keyword_counts : list of dict
            Raw keyword counts for each document
    """
    
    # Define financial keyword categories with weights
    financial_keywords = {
        'positive_performance': {
            'keywords': ['profit', 'revenue', 'growth', 'gain', 'earnings', 'income', 'returns', 
                        'dividend', 'yield', 'bull', 'rally', 'surge', 'soar', 'climb', 'rise',
                        'upward', 'boost', 'strong', 'robust', 'healthy', 'solid', 'improved',
                        'outperform', 'beat', 'exceed', 'record', 'peak', 'high'],
            'weight': 1.0
        },
        'negative_performance': {
            'keywords': ['loss', 'decline', 'fall', 'drop', 'bear', 'crash', 'plunge', 'dive',
                        'slump', 'tumble', 'weak', 'poor', 'disappointing', 'miss', 'underperform',
                        'debt', 'deficit', 'bankruptcy', 'default', 'risk', 'concern', 'worry',
                        'threat', 'challenge', 'struggle', 'downturn', 'recession'],
            'weight': -1.0
        },
        'volatility_uncertainty': {
            'keywords': ['volatile', 'uncertainty', 'unpredictable', 'fluctuate', 'swing',
                        'turbulent', 'unstable', 'variable', 'erratic', 'choppy'],
            'weight': 0.5
        },
        'corporate_actions': {
            'keywords': ['merger', 'acquisition', 'buyout', 'takeover', 'ipo', 'split', 'spinoff',
                        'restructure', 'layoff', 'hiring', 'expansion', 'launch', 'partnership',
                        'deal', 'agreement', 'contract'],
            'weight': 0.3
        },
        'market_events': {
            'keywords': ['fed', 'interest', 'rate', 'policy', 'regulation', 'compliance',
                        'audit', 'investigation', 'lawsuit', 'settlement', 'approval',
                        'election', 'trade', 'tariff', 'sanction'],
            'weight': 0.4
        },
        'financial_metrics': {
            'keywords': ['ebitda', 'eps', 'pe', 'ratio', 'margin', 'cash flow', 'assets',
                        'liabilities', 'equity', 'valuation', 'market cap', 'volume',
                        'shares', 'stock', 'price', 'target', 'forecast', 'guidance'],
            'weight': 0.2
        }
    }
    
    def count_keywords_in_text(text, category_dict):
        """Count occurrences of keywords in text for each category."""
        text_lower = text.lower()
        counts = {}
        
        for category, info in category_dict.items():
            category_count = 0
            for keyword in info['keywords']:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(keyword) + r'\b'
                matches = len(re.findall(pattern, text_lower))
                category_count += matches
            counts[category] = category_count
        
        return counts
    
    def calculate_weighted_sentiment(counts, category_dict):
        """Calculate weighted sentiment score based on keyword counts."""
        weighted_score = 0
        total_keywords = 0
        
        for category, count in counts.items():
            weight = category_dict[category]['weight']
            weighted_score += count * weight
            total_keywords += count
        
        # Normalize by total keywords to get average weighted sentiment
        if total_keywords > 0:
            return weighted_score / total_keywords
        else:
            return 0
    
    # Process all documents
    all_keyword_counts = []
    
    for doc in documents:
        doc_counts = count_keywords_in_text(str(doc), financial_keywords)
        all_keyword_counts.append(doc_counts)
    
    if not return_features:
        return all_keyword_counts
    
    # Create feature matrix
    feature_data = []
    
    for counts in all_keyword_counts:
        doc_features = []
        
        # Add raw counts for each category
        for category in financial_keywords.keys():
            doc_features.append(counts[category])
        
        # Add derived features
        total_keywords = sum(counts.values())
        doc_features.append(total_keywords)  # Total financial keywords
        
        # Weighted sentiment score
        weighted_sentiment = calculate_weighted_sentiment(counts, financial_keywords)
        doc_features.append(weighted_sentiment)
        
        # Positive to negative ratio
        pos_count = counts['positive_performance']
        neg_count = counts['negative_performance']
        if neg_count > 0:
            pos_neg_ratio = pos_count / neg_count
        else:
            pos_neg_ratio = pos_count  # If no negative words, ratio is just positive count
        doc_features.append(pos_neg_ratio)
        
        # Financial keyword density (keywords per 100 words)
        word_count = len(str(documents[len(feature_data)]).split())
        if word_count > 0:
            keyword_density = (total_keywords / word_count) * 100
        else:
            keyword_density = 0
        doc_features.append(keyword_density)
        
        feature_data.append(doc_features)
    
    # Convert to numpy array
    feature_matrix = np.array(feature_data)
    
    # Create feature names
    feature_names = list(financial_keywords.keys()) + [
        'total_financial_keywords',
        'weighted_sentiment_score',
        'positive_negative_ratio',
        'keyword_density_per_100_words'
    ]
    
    # Normalize features if requested
    if normalize and feature_matrix.shape[0] > 1:
        scaler = StandardScaler()
        feature_matrix = scaler.fit_transform(feature_matrix)
    
    # Calculate keyword statistics
    all_counts = Counter()
    for counts in all_keyword_counts:
        for category, count in counts.items():
            all_counts[category] += count
    
    keyword_stats = {
        'total_documents': len(documents),
        'category_totals': dict(all_counts),
        'avg_keywords_per_doc': sum(all_counts.values()) / len(documents),
        'most_common_category': all_counts.most_common(1)[0] if all_counts else ('none', 0)
    }
    
    return feature_matrix, feature_names, keyword_stats

# Example usage and integration function
def integrate_financial_features(processed_documents, X_tfidf):
    """
    Integrate financial keyword features with existing TF-IDF features.
    
    Parameters:
    -----------
    processed_documents : list
        List of preprocessed documents
    X_tfidf : sparse matrix
        Existing TF-IDF feature matrix
    
    Returns:
    --------
    X_combined : numpy array
        Combined feature matrix
    feature_info : dict
        Information about the features
    """
    from scipy.sparse import hstack
    import numpy as np
    
    # Extract financial keyword features
    fin_features, fin_names, fin_stats = extract_financial_keywords(
        processed_documents, return_features=True, normalize=True
    )
    
    # Convert TF-IDF to dense if it's sparse (for small datasets)
    if X_tfidf.shape[1] < 10000:  # Only convert if manageable size
        X_tfidf_dense = X_tfidf.toarray()
        X_combined = np.hstack([X_tfidf_dense, fin_features])
    else:
        # For large TF-IDF matrices, keep sparse and convert financial features to sparse
        from scipy.sparse import csr_matrix
        fin_features_sparse = csr_matrix(fin_features)
        X_combined = hstack([X_tfidf, fin_features_sparse])
    
    feature_info = {
        'tfidf_features': X_tfidf.shape[1],
        'financial_features': len(fin_names),
        'total_features': X_combined.shape[1],
        'financial_feature_names': fin_names,
        'keyword_statistics': fin_stats
    }
    
    return X_combined, feature_info

# Extract financial keyword features and combine with TF-IDF
X_combined, feature_info = integrate_financial_features(processed_documents, X_tfidf)

# Print feature information
print(f"Original TF-IDF features: {feature_info['tfidf_features']}")
print(f"Financial keyword features: {feature_info['financial_features']}")
print(f"Total combined features: {feature_info['total_features']}")
print(f"Financial feature names: {feature_info['financial_feature_names']}")
print(f"Keyword statistics: {feature_info['keyword_statistics']}")

# Prepare the features and target
X = X_combined
y = np.array(labels)

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