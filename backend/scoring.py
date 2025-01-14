import spacy
import joblib  # To load the model and vectorizer you uploaded
from news import fetch_and_return_articles  # Assuming fetch_and_return_articles is in the 'news.py' file

# Load SpaCy's English model
nlp = spacy.load("en_core_web_sm")

# Load the sentiment analysis model and vectorizer (Uploaded model and vectorizer)
sentiment_model = joblib.load('model/regessorModel.joblib')  # Replace with the correct path
vectorizer = joblib.load('model/vectorize.joblib')  # Replace with the correct path

# Function to preprocess text (convert to lowercase)
def preprocess_text(text):
    return text.lower()

# Function to normalize sentiment score to a scale of 0-10
def normalize_sentiment_score(score, min_score=-0.3, max_score=0.45):
    return (score - min_score) / (max_score - min_score) * 10  # Normalized score between 0 and 10

# Function to predict sentiment using the uploaded sentiment model
def get_sentiment_score(text):
    # Preprocess the text and transform using the vectorizer
    vectorized_text = vectorizer.transform([text])
    sentiment_score = sentiment_model.predict(vectorized_text)[0]  # This is your sentiment score
    return sentiment_score

# Function to summarize articles together
def summarize_articles_together(articles):
    combined_text = " ".join(articles)
    doc = nlp(combined_text)  # Tokenize sentences using SpaCy
    sentences = [sent.text for sent in doc.sents]
    return " ".join(sentences[:5])  # Take the first 5 sentences for a quick summary

# Function to process articles and generate sentiment analysis and summary
def process_articles(news_articles):
    min_score = -0.3  # Adjust minimum sentiment score
    max_score = 0.45  # Adjust maximum sentiment score

    headlines = [article['Summary'] for article in news_articles]

    # Create combined summary of all articles
    combined_summary = summarize_articles_together(headlines)

    # Get sentiment score for each article and accumulate the score
    sentiment_scores = [get_sentiment_score(headline) for headline in headlines]
    total_sentiment_score = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

    # Normalize the sentiment score
    normalized_score = normalize_sentiment_score(total_sentiment_score, min_score, max_score)

    # Provide investment advice based on normalized sentiment score
    if normalized_score >= 7:
        investment_advice = "The company's outlook seems generally positive, with multiple growth prospects. It might be a good time to consider an investment."
    elif normalized_score >= 4:
        investment_advice = "The company's situation is a bit mixed with both challenges and opportunities. Investors may want to wait for more clarity before making any investment decisions."
    else:
        investment_advice = "The company's performance appears to be struggling with significant setbacks. It may be wise to hold off on investing for now."

    return {
        "summary": combined_summary,
        "overall_score": normalized_score,
        "investment_advice": investment_advice
    }

# Fetch news articles from the backend and process them
def get_company_sentiment(company_name):
    news_articles = fetch_and_return_articles(company_name)  # This function fetches the articles

    if not news_articles:
        return {"error": "No articles found for this company."}

    return process_articles(news_articles)
