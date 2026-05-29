import json

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load FAQ Data
with open("static/data/faq.json", "r", encoding="utf-8") as file:
    faq_data = json.load(file)

# Extract Questions
questions = [item["question"] for item in faq_data]

# Create TF-IDF Vectorizer
vectorizer = TfidfVectorizer()

# Convert Questions into Vectors
question_vectors = vectorizer.fit_transform(questions)


def get_response(user_question):

    # Clean User Input
    user_question = user_question.lower().strip()

    # Convert User Question into Vector
    user_vector = vectorizer.transform([user_question])

    # Calculate Similarity
    similarity = cosine_similarity(
        user_vector,
        question_vectors
    )

    # Find Best Match
    best_match_index = similarity.argmax()

    best_score = similarity[0][best_match_index]

    # Return Matching Answer
    if best_score > 0.30:
        return faq_data[best_match_index]["answer"]

    # Default Response
    return (
        "I couldn't find an exact answer. "
        "Try asking about AI, Python, Web Development, "
        "Machine Learning, or Technology."
    )