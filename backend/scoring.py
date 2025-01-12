import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import sent_tokenize
import nltk

with open('model/regressorModel.joblib', 'rb') as f:
    model_rf_final = joblib.load(f)

with open('model/tfidf_vectorizer.pkl', 'rb') as f:
    vectorizer = joblib.load(f)

print(f"Number of features in vectorizer: {len(vectorizer.get_feature_names_out())}")

def preprocess_text(text):
    processed_text = text.lower()  
    return processed_text

def normalize_sentiment_score(score, min_score, max_score):
    return (score - min_score) / (max_score - min_score) * 9 + 1  

def summarize_articles(articles):
    combined_text = " ".join(articles)  
    sentences = sent_tokenize(combined_text)
    summary = " ".join(sentences[:5]) 
    return summary


def process_articles(news_articles):
    article_scores = []
    min_score = -0.3  
    max_score = 0.45

    headlines = [article['Headline'] for article in news_articles]

    for article_text in headlines:
        preprocessed_input = preprocess_text(article_text)
 
        test_vectorized = vectorizer.transform([preprocessed_input])
 
        test_vectorized_dense = test_vectorized.toarray()

        if test_vectorized_dense.shape[1] != 500:  
            return {"error": f"Input has {test_vectorized_dense.shape[1]} features, but the model expects 500 features."}

        predicted_score = model_rf_final.predict(test_vectorized_dense)

        normalized_score = normalize_sentiment_score(predicted_score[0], min_score, max_score)

        article_scores.append((article_text, predicted_score[0], normalized_score))

    sum_of_scores = sum(score[2] for score in article_scores)
    average_score = round(sum_of_scores / len(article_scores), 2) if article_scores else 0

    articles_summary = summarize_articles(headlines)  

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
