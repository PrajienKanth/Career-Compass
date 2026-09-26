from collections import defaultdict
from math import sqrt
from typing import Dict, List, Tuple

from app import db

from models import (
    User,
    UserCourse,
    RecommendationInteraction,
)

from utils import load_course_data


# CONFIGURATION

MAX_NEIGHBORS = 20

MIN_SIMILARITY = 0.05

DEFAULT_RECOMMENDATIONS = 6

INTERACTION_WEIGHTS = {

    "view": 1.0,

    "click": 1.5,

    "save": 3.0,

    "planned": 3.0,

    "started": 4.0,

    "in_progress": 4.5,

    "complete": 5.0,

    "completed": 5.0,

}


# TEXT NORMALIZATION

def normalize_text(value):

    if value is None:
        return ""

    return str(value).strip().lower()


# COURSE INDEX

def get_course_index():

    courses = load_course_data()

    return {
        str(course.get("id")): course
        for course in courses
        if course.get("id") is not None
    }


# USER PROFILE TOKENS

def get_user_profile_tokens(user):

    tokens = set()

    # Academic domain

    if user.academic_domain:

        tokens.add(
            normalize_text(
                user.academic_domain
            )
        )


    # Specialization

    if user.specialization:

        tokens.add(
            normalize_text(
                user.specialization
            )
        )


    # Skills

    skills = user.get_skills()

    if isinstance(skills, dict):

        for skill, value in skills.items():

            try:

                numeric_value = float(
                    value
                )

            except (
                TypeError,
                ValueError
            ):

                numeric_value = 1


            if numeric_value > 0:

                tokens.add(
                    normalize_text(skill)
                )

    return {
        token
        for token in tokens
        if token
    }


# COURSE TOKENS

def get_course_tokens(course):

    tokens = set()

    fields = [

        course.get("domain"),

        course.get("title"),

    ]

    for field in fields:

        if isinstance(field, str):

            tokens.update(
                normalize_text(field)
                .replace("/", " ")
                .replace("-", " ")
                .split()
            )


    for skill in course.get(
        "skills",
        []
    ):

        tokens.add(
            normalize_text(skill)
        )


    for domain in course.get(
        "related_domains",
        []
    ):

        tokens.add(
            normalize_text(domain)
        )


    return {
        token
        for token in tokens
        if token
    }


# CONTENT RELEVANCE

def calculate_profile_relevance(
    user,
    course
):

    user_tokens = get_user_profile_tokens(
        user
    )

    course_tokens = get_course_tokens(
        course
    )

    if not user_tokens or not course_tokens:

        return 0.0


    overlap = (
        user_tokens &
        course_tokens
    )


    if not overlap:

        return 0.0


    # Jaccard-style relevance.
    union = (
        user_tokens |
        course_tokens
    )

    if not union:

        return 0.0


    return (
        len(overlap) /
        len(union)
    )


# BUILD USER-ITEM MATRIX

def build_interaction_matrix():

    matrix = defaultdict(
        lambda: defaultdict(float)
    )


    # Explicit / implicit interaction events

    interactions = (
        RecommendationInteraction.query
        .filter_by(
            item_type="course"
        )
        .all()
    )


    for interaction in interactions:

        user_id = interaction.user_id

        item_id = str(
            interaction.item_id
        )


        try:

            weight = float(
                interaction.weight
            )

        except (
            TypeError,
            ValueError
        ):

            weight = 0.0


        matrix[user_id][item_id] += weight

    enrollments = (
        UserCourse.query
        .all()
    )


    for enrollment in enrollments:

        user_id = enrollment.user_id

        item_id = str(
            enrollment.course_id
        )


        weight = (
            INTERACTION_WEIGHTS["save"]
        )


        status = normalize_text(
            getattr(
                enrollment,
                "status",
                "planned"
            )
        )


        progress = getattr(
            enrollment,
            "progress",
            0
        )


        try:

            progress = float(
                progress or 0
            )

        except (
            TypeError,
            ValueError
        ):

            progress = 0


        
        # Status contribution
        

        if status in {
            "completed",
            "complete"
        }:

            weight = (
                INTERACTION_WEIGHTS[
                    "completed"
                ]
            )

        elif status in {
            "in_progress",
            "in progress",
            "ongoing",
            "started"
        }:

            weight = (
                INTERACTION_WEIGHTS[
                    "in_progress"
                ]
            )


        
        # Progress contribution
        

        if progress > 0:

            progress_bonus = (
                min(
                    progress,
                    100
                ) / 100
            ) * 2.0

            weight += progress_bonus


        matrix[user_id][item_id] = max(
            matrix[user_id][item_id],
            weight
        )


    return matrix


# COSINE SIMILARITY

def cosine_similarity(
    vector_a,
    vector_b
):

    if not vector_a or not vector_b:

        return 0.0


    shared_items = (
        set(vector_a.keys()) &
        set(vector_b.keys())
    )


    if not shared_items:

        return 0.0


    dot_product = 0.0

    magnitude_a = 0.0

    magnitude_b = 0.0


    for item in shared_items:

        a = float(
            vector_a.get(
                item,
                0
            )
        )

        b = float(
            vector_b.get(
                item,
                0
            )
        )


        dot_product += (
            a * b
        )


    for value in vector_a.values():

        magnitude_a += (
            float(value) ** 2
        )


    for value in vector_b.values():

        magnitude_b += (
            float(value) ** 2
        )


    magnitude_a = sqrt(
        magnitude_a
    )

    magnitude_b = sqrt(
        magnitude_b
    )


    if (
        magnitude_a == 0
        or magnitude_b == 0
    ):

        return 0.0


    return (
        dot_product /
        (
            magnitude_a *
            magnitude_b
        )
    )


# FIND SIMILAR USERS

def find_similar_users(
    user_id,
    matrix=None,
    limit=MAX_NEIGHBORS
):

    if matrix is None:

        matrix = (
            build_interaction_matrix()
        )


    target_vector = (
        matrix.get(
            user_id,
            {}
        )
    )


    if not target_vector:

        return []


    similarities = []


    for other_user_id, vector in matrix.items():

        if other_user_id == user_id:
            continue


        similarity = cosine_similarity(
            target_vector,
            vector
        )


        if similarity >= MIN_SIMILARITY:

            similarities.append(
                (
                    other_user_id,
                    similarity
                )
            )


    similarities.sort(
        key=lambda item: item[1],
        reverse=True
    )


    return similarities[:limit]


# COLLABORATIVE COURSE SCORES

def collaborative_course_scores(
    user_id,
    matrix=None
):

    if matrix is None:

        matrix = (
            build_interaction_matrix()
        )


    user_vector = (
        matrix.get(
            user_id,
            {}
        )
    )


    if not user_vector:

        return {}


    neighbors = (
        find_similar_users(
            user_id,
            matrix
        )
    )


    if not neighbors:

        return {}


    scores = defaultdict(float)

    similarity_totals = defaultdict(float)


    for neighbor_id, similarity in neighbors:

        neighbor_vector = (
            matrix.get(
                neighbor_id,
                {}
            )
        )


        for item_id, interaction in neighbor_vector.items():

            if item_id in user_vector:
                continue


            scores[item_id] += (
                similarity *
                interaction
            )

            similarity_totals[item_id] += (
                similarity
            )


    final_scores = {}


    for item_id, score in scores.items():

        denominator = (
            similarity_totals.get(
                item_id,
                0
            )
        )


        if denominator <= 0:
            continue


        final_scores[item_id] = (
            score /
            denominator
        )


    return final_scores


# NORMALIZE SCORE DICTIONARY

def normalize_scores(scores):

    if not scores:

        return {}


    maximum = max(
        scores.values()
    )


    minimum = min(
        scores.values()
    )


    if maximum == minimum:

        return {
            key: 1.0
            for key in scores
        }


    return {

        key:
            (
                value - minimum
            )
            /
            (
                maximum - minimum
            )

        for key, value in scores.items()

    }


# POPULARITY

def calculate_popularity(
    matrix
):

    popularity = defaultdict(float)


    for user_vector in matrix.values():

        for item_id, weight in user_vector.items():

            popularity[item_id] += (
                max(
                    0,
                    float(weight)
                )
            )


    return dict(popularity)


# HYBRID RECOMMENDATIONS

def get_recommendations(
    user,
    limit=DEFAULT_RECOMMENDATIONS
):

    course_index = (
        get_course_index()
    )


    if not course_index:

        return []


    matrix = (
        build_interaction_matrix()
    )


    user_vector = (
        matrix.get(
            user.id,
            {}
        )
    )


    already_seen = set(
        user_vector.keys()
    )


    # Collaborative filtering

    cf_scores = (
        collaborative_course_scores(
            user.id,
            matrix
        )
    )


    cf_scores = normalize_scores(
        cf_scores
    )


    # Popularity

    popularity_scores = (
        calculate_popularity(
            matrix
        )
    )


    popularity_scores = normalize_scores(
        popularity_scores
    )


    # Candidate generation

    candidate_ids = set(
        course_index.keys()
    )

    candidate_ids -= already_seen


    results = []


    for course_id in candidate_ids:

        course = (
            course_index[
                course_id
            ]
        )


        cf_score = float(
            cf_scores.get(
                course_id,
                0
            )
        )


        popularity_score = float(
            popularity_scores.get(
                course_id,
                0
            )
        )


        profile_score = (
            calculate_profile_relevance(
                user,
                course
            )
        )
        

        similar_users = (
            find_similar_users(
                user.id,
                matrix
            )
        )


        if similar_users:

            cf_weight = 0.65

            profile_weight = 0.25

            popularity_weight = 0.10

        else:

            cf_weight = 0.15

            profile_weight = 0.65

            popularity_weight = 0.20


        final_score = (

            cf_score *
            cf_weight

            +

            profile_score *
            profile_weight

            +

            popularity_score *
            popularity_weight

        )


        
        # Explanation
        

        if cf_score >= 0.45:

            reason = (
                "Learners with similar "
                "course activity explored "
                "this course."
            )

            source = (
                "collaborative_filtering"
            )

        elif profile_score >= 0.25:

            reason = (
                "This course matches "
                "your profile and "
                "learning interests."
            )

            source = (
                "profile_relevance"
            )

        else:

            reason = (
                "This course is gaining "
                "interest among learners."
            )

            source = (
                "popular"
            )


        results.append({

            "course": course,

            "course_id": course_id,

            "score": round(
                final_score * 100,
                2
            ),

            "cf_score": round(
                cf_score * 100,
                2
            ),

            "profile_score": round(
                profile_score * 100,
                2
            ),

            "popularity_score": round(
                popularity_score * 100,
                2
            ),

            "source": source,

            "reason": reason,

        })


    results.sort(
        key=lambda item: item["score"],
        reverse=True
    )


    return results[:limit]


# RECORD INTERACTION

def record_interaction(
    user_id,
    item_id,
    interaction_type,
    item_type="course"
):

    interaction_type = normalize_text(
        interaction_type
    )


    weight = (
        INTERACTION_WEIGHTS.get(
            interaction_type,
            1.0
        )
    )


    interaction = (
        RecommendationInteraction(
            user_id=user_id,
            item_id=str(item_id),
            item_type=item_type,
            interaction_type=interaction_type,
            weight=weight
        )
    )


    db.session.add(
        interaction
    )

    db.session.commit()


    return interaction


# COURSE INTERACTION HELPER

def record_course_interaction(
    user_id,
    course_id,
    interaction_type
):

    return record_interaction(
        user_id=user_id,
        item_id=course_id,
        item_type="course",
        interaction_type=interaction_type
    )