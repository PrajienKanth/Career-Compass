import logging

from gemini_service import (
    generate_advisor_response
)


logger = logging.getLogger(__name__)


# USER PROGRESS ANALYZER

def analyze_user_progress(context):

    context = context or {}

    improvements = []


    missing_skills = context.get(
        "missing_skills",
        []
    )

    if missing_skills:

        improvements.append({
            "type": "skill_gap",
            "priority": "high",
            "title": "Close your skill gaps",
            "items": missing_skills
        })


    if context.get(
        "assessment_declined",
        False
    ):

        improvements.append({
            "type": "assessment",
            "priority": "high",
            "title": "Improve assessment performance",
            "items": context.get(
                "weak_areas",
                []
            )
        })


    if context.get(
        "low_coding_activity",
        False
    ):

        improvements.append({
            "type": "coding",
            "priority": "medium",
            "title": "Increase coding practice"
        })


    if context.get(
        "low_learning_progress",
        False
    ):

        improvements.append({
            "type": "learning",
            "priority": "medium",
            "title": "Continue your learning plan"
        })


    return improvements


# BACKWARD COMPATIBLE RESPONSE

def get_gemini_response(
    user_message,
    user_context=""
):

    try:

        if isinstance(
            user_context,
            dict
        ):

            context = user_context

        else:

            context = {
                "profile": str(
                    user_context or ""
                )
            }


        return generate_advisor_response(

            message=user_message,

            user_context=context,

            conversation_history=[]

        )


    except Exception:

        logger.exception(
            "Gemini compatibility call failed"
        )

        return (
            "Compass AI is temporarily unavailable. "
            "Please try again later."
        )


# CAREER RECOMMENDATIONS

def get_career_recommendations(
    user_profile
):

    try:

        if not isinstance(
            user_profile,
            dict
        ):

            user_profile = {
                "profile": str(
                    user_profile
                )
            }


        prompt = """
Based on my career profile, suggest relevant career paths.

Give 3 to 5 career paths.

For each path provide:

- Career title
- Why it may fit my profile
- Important skills to develop
- One practical next step

Use only the information supplied in my profile.

Do not invent qualifications, experience,
achievements, skills or education.
"""


        response = generate_advisor_response(

            message=prompt,

            user_context=user_profile,

            conversation_history=[]

        )


        if not response:

            return [
                "Unable to generate career recommendations."
            ]


        recommendations = []


        for line in response.splitlines():

            line = line.strip()


            if not line:

                continue


            if any(
                line.startswith(
                    f"{number}."
                )
                for number in range(1, 10)
            ):

                recommendations.append(
                    line
                )


        if recommendations:

            return recommendations


        return [
            response
        ]


    except Exception:

        logger.exception(
            "Career recommendation generation failed"
        )

        return [
            "Unable to generate career recommendations "
            "right now."
        ]