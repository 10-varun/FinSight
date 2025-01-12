import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import sent_tokenize
import nltk

# Load the pre-trained RandomForest model and TF-IDF vectorizer
with open('model/regessorModel.joblib', 'rb') as f:
    model_rf_final = joblib.load(f)

with open('model/vectorize.joblib', 'rb') as f:
    vectorizer = joblib.load(f)

# Print the number of features in the loaded vectorizer
print(f"Number of features in vectorizer: {len(vectorizer.get_feature_names_out())}")

# Function to preprocess text (convert to lowercase)
def preprocess_text(text):
    processed_text = text.lower()  
    return processed_text

# Function to normalize sentiment score to a scale of 1-10
def normalize_sentiment_score(score, min_score, max_score):
    return (score - min_score) / (max_score - min_score) * 9 + 1  

# Function to summarize articles
def summarize_articles(articles):
    combined_text = " ".join(articles)  
    sentences = sent_tokenize(combined_text)
    summary = " ".join(sentences[:5])  # Use the first 5 sentences as a summary
    return summary

# Function to process articles and generate sentiment analysis
def process_articles(news_articles):
    article_scores = []
    min_score = -0.3  # Adjust minimum sentiment score
    max_score = 0.45  # Adjust maximum sentiment score

    # Extract headlines from news articles
    headlines = [article['Headline'] for article in news_articles]

    # Process each headline
    for article_text in headlines:
        preprocessed_input = preprocess_text(article_text)
        
        # Transform input text using TF-IDF vectorizer
        test_vectorized = vectorizer.transform([preprocessed_input])
        test_vectorized_dense = test_vectorized.toarray()

        # Check for feature mismatch
        expected_features = len(vectorizer.get_feature_names_out())
        if test_vectorized_dense.shape[1] != expected_features:
            return {"error": f"Input has {test_vectorized_dense.shape[1]} features, but the model expects {expected_features} features."}

        # Predict sentiment score
        predicted_score = model_rf_final.predict(test_vectorized_dense)

        # Normalize the sentiment score
        normalized_score = normalize_sentiment_score(predicted_score[0], min_score, max_score)

        # Append result
        article_scores.append((article_text, predicted_score[0], normalized_score))

    # Calculate summary statistics
    sum_of_scores = sum(score[2] for score in article_scores)
    average_score = round(sum_of_scores / len(article_scores), 2) if article_scores else 0

    # Generate article summary
    articles_summary = summarize_articles(headlines)  

    # Provide investment advice based on average score
    if average_score >= 7:
        investment_advice = "The company's outlook seems generally positive, with multiple growth prospects. It might be a good time to consider an investment."
    elif average_score >= 4:
        investment_advice = "The company's situation is a bit mixed with both challenges and opportunities. Investors may want to wait for more clarity before making any investment decisions."
    else:
        investment_advice = "The company's performance appears to be struggling with significant setbacks. It may be wise to hold off on investing for now."

    return {
        "summary": articles_summary,
        "article_scores": [{"headline": article, "original_score": original_score, "normalized_score": normalized_score}
                           for article, original_score, normalized_score in article_scores],
        "sum_of_scores": sum_of_scores,
        "average_score": average_score,
        "investment_advice": investment_advice
    }
