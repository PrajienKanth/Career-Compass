import os
import json
from datetime import datetime

def load_course_data():
    """Load course data from the project's data/courses.json file."""

    base_dir = os.path.dirname(
        os.path.abspath(__file__)
    )

    courses_path = os.path.join(
        base_dir,
        "data",
        "courses.json"
    )

    try:

        with open(
            courses_path,
            "r",
            encoding="utf-8"
        ) as f:

            data = json.load(f)


        # Make sure JSON contains a list
        if not isinstance(data, list):

            print(
                "WARNING: courses.json does not contain a list."
            )

            return []


        # Make sure every item is a dictionary
        courses = [
            course
            for course in data
            if isinstance(course, dict)
        ]


        print(
            f"Loaded {len(courses)} courses from:"
            f" {courses_path}"
        )


        return courses


    except FileNotFoundError:

        print(
            f"WARNING: courses.json not found at:"
            f" {courses_path}"
        )

    except json.JSONDecodeError as error:

        print(
            f"WARNING: Invalid courses.json:"
            f" {error}"
        )

    except Exception as error:

        print(
            f"WARNING: Could not load courses:"
            f" {error}"
        )


    # =====================================================
    # FALLBACK COURSES
    # =====================================================

    return [

        {
            "id": "cs101",
            "title": "Introduction to Computer Science",
            "institution": "Anna University",
            "domain": "computer_science",
            "description": (
                "Fundamental concepts of programming "
                "and computer science."
            ),
            "duration": "4 months",
            "level": "Beginner",
            "related_domains": [
                "electrical",
                "electronics"
            ],
            "skills": [
                "programming",
                "algorithms"
            ]
        },

        {
            "id": "ds201",
            "title": "Data Structures and Algorithms",
            "institution": "Anna University",
            "domain": "computer_science",
            "description": (
                "Advanced study of data structures "
                "and algorithmic techniques."
            ),
            "duration": "4 months",
            "level": "Intermediate",
            "related_domains": [
                "computer_science"
            ],
            "skills": [
                "data_structures",
                "algorithms"
            ]
        },

        {
            "id": "ml301",
            "title": "Machine Learning Fundamentals",
            "institution": "Anna University",
            "domain": "computer_science",
            "description": (
                "Introduction to machine learning "
                "concepts and applications."
            ),
            "duration": "3 months",
            "level": "Intermediate",
            "related_domains": [
                "computer_science",
                "electrical"
            ],
            "skills": [
                "machine_learning",
                "programming"
            ]
        },

        {
            "id": "ee101",
            "title": "Basic Electrical Engineering",
            "institution": "Anna University",
            "domain": "electrical",
            "description": (
                "Fundamentals of electrical engineering "
                "and circuits."
            ),
            "duration": "4 months",
            "level": "Beginner",
            "related_domains": [
                "electronics"
            ],
            "skills": []
        },

        {
            "id": "me101",
            "title": "Engineering Mechanics",
            "institution": "Anna University",
            "domain": "mechanical",
            "description": (
                "Basic concepts of forces, motion, "
                "and mechanical systems."
            ),
            "duration": "4 months",
            "level": "Beginner",
            "related_domains": [
                "civil"
            ],
            "skills": []
        }
    ]


def load_coding_problems():
    """Load coding problems from JSON file."""
    try:
        with open('data/coding_problems.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Return default problems if file not found or invalid
        return [
            {
                "id": "p1",
                "title": "Two Sum",
                "difficulty": "Easy",
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "example": "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
                "test_cases": [
                    {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expected": [0, 1]},
                    {"input": {"nums": [3, 2, 4], "target": 6}, "expected": [1, 2]}
                ]
            },
            {
                "id": "p2",
                "title": "Reverse String",
                "difficulty": "Easy",
                "description": "Write a function that reverses a string. The input string is given as an array of characters s.",
                "example": "Input: s = ['h','e','l','l','o']\nOutput: ['o','l','l','e','h']",
                "test_cases": [
                    {"input": {"s": ["h", "e", "l", "l", "o"]}, "expected": ["o", "l", "l", "e", "h"]},
                    {"input": {"s": ["H", "a", "n", "n", "a", "h"]}, "expected": ["h", "a", "n", "n", "a", "H"]}
                ]
            },
            {
                "id": "p3",
                "title": "FizzBuzz",
                "difficulty": "Easy",
                "description": "Write a program that outputs the string representation of numbers from 1 to n. But for multiples of three it should output 'Fizz' instead of the number and for the multiples of five output 'Buzz'. For numbers which are multiples of both three and five output 'FizzBuzz'.",
                "example": "Input: n = 15\nOutput: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']",
                "test_cases": [
                    {"input": {"n": 15}, "expected": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]}
                ]
            },
            {
                "id": "p4",
                "title": "Palindrome Number",
                "difficulty": "Easy",
                "description": "Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward.",
                "example": "Input: x = 121\nOutput: true\nInput: x = -121\nOutput: false\nExplanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
                "test_cases": [
                    {"input": {"x": 121}, "expected": True},
                    {"input": {"x": -121}, "expected": False},
                    {"input": {"x": 10}, "expected": False}
                ]
            },
            {
                "id": "p5",
                "title": "Valid Parentheses",
                "difficulty": "Medium",
                "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
                "example": "Input: s = '()'\nOutput: true\nInput: s = '()[]{}'\nOutput: true\nInput: s = '(]'\nOutput: false",
                "test_cases": [
                    {"input": {"s": "()"}, "expected": True},
                    {"input": {"s": "()[]{}"}, "expected": True},
                    {"input": {"s": "(]"}, "expected": False}
                ]
            }
        ]

def load_aptitude_questions():
    """Load aptitude questions from JSON file."""
    try:
        with open('data/aptitude_questions.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Return default questions if file not found or invalid
        return {
            "logical": [
                {
                    "id": 1,
                    "question": "If all Zips are Zaps, and some Zaps are Zops, then:",
                    "options": [
                        "All Zips are definitely Zops",
                        "Some Zips are definitely Zops",
                        "No Zips are definitely Zops",
                        "None of the above"
                    ],
                    "correct_answer": "1"
                },
                {
                    "id": 2,
                    "question": "Find the next number in the sequence: 2, 3, 5, 8, 13, ___",
                    "options": [
                        "15",
                        "18",
                        "21",
                        "24"
                    ],
                    "correct_answer": "2"
                },
                {
                    "id": 3,
                    "question": "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
                    "options": [
                        "5 minutes",
                        "100 minutes",
                        "20 minutes",
                        "500 minutes"
                    ],
                    "correct_answer": "0"
                }
            ],
            "verbal": [
                {
                    "id": 1,
                    "question": "Choose the word most similar to 'Diligent':",
                    "options": [
                        "Lazy",
                        "Industrious",
                        "Intelligent",
                        "Negligent"
                    ],
                    "correct_answer": "1"
                },
                {
                    "id": 2,
                    "question": "Complete the analogy: Book is to Reading as Fork is to:",
                    "options": [
                        "Drawing",
                        "Writing",
                        "Eating",
                        "Cooking"
                    ],
                    "correct_answer": "2"
                },
                {
                    "id": 3,
                    "question": "Choose the sentence with the correct grammar:",
                    "options": [
                        "Neither of the students have completed their assignments.",
                        "Neither of the students has completed their assignments.",
                        "Neither of the students has completed his assignments.",
                        "Neither of the students have completed his assignments."
                    ],
                    "correct_answer": "2"
                }
            ],
            "quantitative": [
                {
                    "id": 1,
                    "question": "If a train travels at 60 km/h, how many minutes will it take to travel 30 km?",
                    "options": [
                        "15 minutes",
                        "30 minutes",
                        "45 minutes",
                        "60 minutes"
                    ],
                    "correct_answer": "1"
                },
                {
                    "id": 2,
                    "question": "What is 15% of 80?",
                    "options": [
                        "8",
                        "12",
                        "15",
                        "18"
                    ],
                    "correct_answer": "1"
                },
                {
                    "id": 3,
                    "question": "A shopkeeper bought a watch for Rs. 400 and sold it for Rs. 500. What is the profit percentage?",
                    "options": [
                        "20%",
                        "25%",
                        "100%",
                        "125%"
                    ],
                    "correct_answer": "1"
                }
            ],
            "technical": [
                {
                    "id": 1,
                    "question": "Which of the following is not a programming language?",
                    "options": [
                        "Java",
                        "Python",
                        "HTML",
                        "Oracle"
                    ],
                    "correct_answer": "3"
                },
                {
                    "id": 2,
                    "question": "What does CPU stand for?",
                    "options": [
                        "Central Processing Unit",
                        "Computer Processing Unit",
                        "Central Program Unit",
                        "Central Processor Unit"
                    ],
                    "correct_answer": "0"
                },
                {
                    "id": 3,
                    "question": "Which data structure operates on the LIFO principle?",
                    "options": [
                        "Queue",
                        "Stack",
                        "Linked List",
                        "Tree"
                    ],
                    "correct_answer": "1"
                }
            ]
        }

def calculate_age(dob):
    """Calculate age from date of birth."""
    if not dob:
        return None
    today = datetime.now()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    return age

def get_code_starters(problem, language="python"):
    """
    Return starter code for a coding problem.

    The coding compiler exposes:
        Python      -> test_input
        JavaScript  -> testInput

    The starter code therefore reads the supplied test case
    and prints the expected solution output.
    """

    problem_id = str(problem.get("id", "")).lower()

    starters = {
        "p1": {
            "python": """# Two Sum
            # test_input contains:
            # {
            #     "nums": [...],
            #     "target": ...
            # }

            nums = test_input["nums"]
            target = test_input["target"]

            # Write your solution here.
            result = []

            print(result)
            """,

                        "javascript": """// Two Sum
            // testInput contains:
            // {
            //     nums: [...],
            //     target: ...
            // }

            const nums = testInput.nums;
            const target = testInput.target;

            // Write your solution here.
            let result = [];

            console.log(JSON.stringify(result));
            """
                    },

                    "p2": {
                        "python": """# Reverse String
            # test_input contains:
            # {
            #     "s": [...]
            # }

            s = test_input["s"]

            # Write your solution here.
            result = []

            print(result)
            """,

                        "javascript": """// Reverse String
            // testInput contains:
            // {
            //     s: [...]
            // }

            const s = testInput.s;

            // Write your solution here.
            let result = [];

            console.log(JSON.stringify(result));
            """
                    },

                    "p3": {
                        "python": """# FizzBuzz
            # test_input contains:
            # {
            #     "n": ...
            # }

            n = test_input["n"]

            # Write your solution here.
            result = []

            print(result)
            """,

                        "javascript": """// FizzBuzz
            // testInput contains:
            // {
            //     n: ...
            // }

            const n = testInput.n;

            // Write your solution here.
            let result = [];

            console.log(JSON.stringify(result));
            """
                    },

                    "p4": {
                        "python": """# Palindrome Number
            # test_input contains:
            # {
            #     "x": ...
            # }

            x = test_input["x"]

            # Write your solution here.
            result = False

            print(result)
            """,

                        "javascript": """// Palindrome Number
            // testInput contains:
            // {
            //     x: ...
            // }

            const x = testInput.x;

            // Write your solution here.
            let result = false;

            console.log(JSON.stringify(result));
            """
                    },

                    "p5": {
                        "python": """# Valid Parentheses
            # test_input contains:
            # {
            #     "s": "..."
            # }

            s = test_input["s"]

            # Write your solution here.
            result = False

            print(result)
            """,

                        "javascript": """// Valid Parentheses
            // testInput contains:
            // {
            //     s: "..."
            // }

            const s = testInput.s;

            // Write your solution here.
            let result = false;

            console.log(JSON.stringify(result));
            """
        }
    }

    language = (
        language
        if language in ("python", "javascript")
        else "python"
    )

    if problem_id in starters:
        return starters[problem_id].get(
            language,
            starters[problem_id]["python"]
        )

    if language == "javascript":
        return """// Write your solution below.
    // The current test case is available as:
    // testInput

    console.log(JSON.stringify(null));
    """

        return """# Write your solution below.
    # The current test case is available as:
    # test_input

    print(None)
    """

# COLLABORATIVE FILTERING RECOMMENDATION SYSTEM

INTERACTION_WEIGHTS = {
    "view": 1.0,
    "click": 1.5,
    "save": 3.0,
    "started": 4.0,
    "in_progress": 4.5,
    "completed": 5.0,
}


def record_course_interaction(
    user_id,
    course_id,
    interaction_type
):
    """
    Record a course interaction for a user.

    Repeated interactions are stored as separate events.
    The recommendation engine aggregates their weights later.
    """

    try:

        from models import RecommendationInteraction
        from app import db

        course_id = str(course_id).strip()

        interaction_type = str(
            interaction_type
        ).strip().lower()

        if not course_id:
            return False

        if interaction_type not in INTERACTION_WEIGHTS:
            return False

        interaction = RecommendationInteraction(
            user_id=user_id,
            item_id=course_id,
            item_type="course",
            interaction_type=interaction_type,
            weight=INTERACTION_WEIGHTS[
                interaction_type
            ],
            created_at=datetime.utcnow()
        )

        db.session.add(interaction)

        db.session.commit()

        return True

    except Exception as error:

        try:
            db.session.rollback()
        except Exception:
            pass

        print(
            "Recommendation interaction error:",
            error
        )

        return False


def build_user_course_matrix():
    """
    Build the user-course interaction matrix.

    Example:

        {
            1: {
                "cs101": 4.0,
                "ml301": 8.0
            },
            2: {
                "cs101": 5.0,
                "ds201": 3.0
            }
        }
    """

    from models import RecommendationInteraction

    matrix = defaultdict(
        lambda: defaultdict(float)
    )

    interactions = (
        RecommendationInteraction.query
        .filter_by(
            item_type="course"
        )
        .all()
    )

    for interaction in interactions:

        user_id = interaction.user_id

        course_id = str(
            interaction.item_id
        )

        weight = float(
            interaction.weight or 0
        )

        matrix[user_id][course_id] += weight

    return matrix


def cosine_similarity(
    user_a,
    user_b
):
    """
    Calculate cosine similarity between
    two users.
    """

    if not user_a or not user_b:
        return 0.0

    common_courses = (
        set(user_a.keys())
        & set(user_b.keys())
    )

    if not common_courses:
        return 0.0

    dot_product = sum(
        user_a[course_id]
        * user_b[course_id]
        for course_id in common_courses
    )

    magnitude_a = sqrt(
        sum(
            value ** 2
            for value in user_a.values()
        )
    )

    magnitude_b = sqrt(
        sum(
            value ** 2
            for value in user_b.values()
        )
    )

    if magnitude_a == 0:
        return 0.0

    if magnitude_b == 0:
        return 0.0

    return (
        dot_product
        / (
            magnitude_a
            * magnitude_b
        )
    )


def find_similar_users(
    user_id,
    matrix,
    minimum_similarity=0.05
):
    """
    Find users with similar course
    interaction patterns.
    """

    current_user = matrix.get(
        user_id,
        {}
    )

    if not current_user:
        return []

    similar_users = []

    for other_user_id, other_user in matrix.items():

        if other_user_id == user_id:
            continue

        similarity = cosine_similarity(
            current_user,
            other_user
        )

        if similarity >= minimum_similarity:

            similar_users.append({
                "user_id": other_user_id,
                "similarity": similarity
            })

    similar_users.sort(
        key=lambda item: item["similarity"],
        reverse=True
    )

    return similar_users


def get_collaborative_scores(
    user_id,
    matrix,
    max_similar_users=20
):
    """
    Generate course scores using
    user-user collaborative filtering.
    """

    current_user = matrix.get(
        user_id,
        {}
    )

    if not current_user:
        return {}

    similar_users = find_similar_users(
        user_id,
        matrix
    )

    similar_users = similar_users[
        :max_similar_users
    ]

    scores = defaultdict(float)

    similarity_totals = defaultdict(float)

    for similar_user in similar_users:

        other_user_id = (
            similar_user["user_id"]
        )

        similarity = (
            similar_user["similarity"]
        )

        other_user = matrix.get(
            other_user_id,
            {}
        )

        for course_id, interaction_score in (
            other_user.items()
        ):

            # Do not recommend a course
            # the current user already knows.

            if course_id in current_user:
                continue

            scores[course_id] += (
                similarity
                * interaction_score
            )

            similarity_totals[course_id] += (
                similarity
            )

    normalized_scores = {}

    for course_id, score in scores.items():

        total_similarity = (
            similarity_totals[course_id]
        )

        if total_similarity <= 0:
            continue

        normalized_scores[course_id] = (
            score / total_similarity
        )

    return normalized_scores


def calculate_profile_relevance(
    user,
    course
):
    """
    Calculate profile-based relevance.

    Used mainly for cold-start users who
    do not have enough interaction history.
    """

    score = 0.0

    academic_domain = str(
        getattr(
            user,
            "academic_domain",
            ""
        ) or ""
    ).strip().lower()

    specialization = str(
        getattr(
            user,
            "specialization",
            ""
        ) or ""
    ).strip().lower()

    course_domain = str(
        course.get(
            "domain",
            ""
        ) or ""
    ).strip().lower()

    related_domains = [
        str(domain).strip().lower()
        for domain in course.get(
            "related_domains",
            []
        )
    ]

    # Academic-domain match.

    if academic_domain:

        if academic_domain == course_domain:

            score += 60

        elif academic_domain in related_domains:

            score += 35

    # Specialization match.

    if specialization:

        specialization_words = set(
            specialization
            .replace(",", " ")
            .replace("/", " ")
            .split()
        )

        course_text = " ".join([
            str(
                course.get(
                    "title",
                    ""
                )
            ),
            str(
                course.get(
                    "description",
                    ""
                )
            ),
            course_domain,
            " ".join(
                course.get(
                    "skills",
                    []
                )
            )
        ]).lower()

        for word in specialization_words:

            if len(word) <= 2:
                continue

            if word in course_text:
                score += 10

    return min(
        score,
        100
    )


def get_course_interaction_counts():
    """
    Calculate overall course popularity.

    Popularity is used as a fallback when
    collaborative information is unavailable.
    """

    from models import RecommendationInteraction

    popularity = defaultdict(float)

    interactions = (
        RecommendationInteraction.query
        .filter_by(
            item_type="course"
        )
        .all()
    )

    for interaction in interactions:

        course_id = str(
            interaction.item_id
        )

        popularity[course_id] += float(
            interaction.weight or 0
        )

    return dict(popularity)


def get_recommendations(
    user=None,
    limit=3
):
    """
    Generate hybrid course recommendations.

    Strategy:

        Collaborative filtering
        +
        Profile relevance
        +
        Popularity fallback
    """

    if user is None:
        return []

    courses = load_course_data()

    if not courses:
        return []

    matrix = build_user_course_matrix()

    user_id = user.id

    current_user = matrix.get(
        user_id,
        {}
    )

    collaborative_scores = (
        get_collaborative_scores(
            user_id,
            matrix
        )
    )

    popularity = (
        get_course_interaction_counts()
    )

    candidates = []

    for course in courses:

        course_id = str(
            course.get(
                "id",
                ""
            )
        ).strip()

        if not course_id:
            continue

        if course_id in current_user:
            continue

        profile_score = (
            calculate_profile_relevance(
                user,
                course
            )
        )

        collaborative_score = (
            collaborative_scores.get(
                course_id,
                0.0
            )
        )

        popularity_score = (
            popularity.get(
                course_id,
                0.0
            )
        )

        # Collaborative recommendation.

        if collaborative_score > 0:

            final_score = (
                collaborative_score * 0.75
                + profile_score * 0.25
            )

            source = (
                "collaborative_filtering"
            )

            reason = (
                "Learners with similar "
                "learning activity explored "
                "this course."
            )

        # Profile-based recommendation.

        elif profile_score > 0:

            final_score = profile_score

            source = (
                "profile_relevance"
            )

            reason = (
                "This course matches your "
                "academic profile."
            )

        # Popularity fallback.

        elif popularity_score > 0:

            final_score = min(
                popularity_score,
                25
            )

            source = "popular"

            reason = (
                "This course has received "
                "interest from learners."
            )

        # Catalog fallback.

        else:

            final_score = 1.0

            source = "catalog"

            reason = (
                "This course is available "
                "in the Career Compass catalog."
            )

        candidates.append({

            "course": course,

            "course_id": course_id,

            "score": round(
                min(
                    final_score,
                    99
                ),
                1
            ),

            "source": source,

            "reason": reason

        })

    candidates.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return candidates[:limit]