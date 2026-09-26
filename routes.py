import os
import json
import time
from datetime import datetime

from flask import (
    render_template,
    url_for,
    flash,
    redirect,
    request,
    jsonify,
    abort,
)

from flask_login import (
    login_user,
    logout_user,
    current_user,
    login_required,
)

from werkzeug.utils import secure_filename

from app import app, db
from uploads import save_profile_photo

from models import (
    User,
    UserCourse,
    CodeSubmission,
    AptitudeResult,
    ChatHistory,
)

from forms import (
    RegistrationForm,
    LoginForm,
    UpdateProfileForm,
    SkillsForm,
    ChatForm,
    CodeSubmissionForm,
)

from gemini_api import get_gemini_response
from code_compiler import compile_and_run

from utils import (
    load_course_data,
    load_coding_problems,
    load_aptitude_questions,
)

from collaborative_filtering import (
    get_recommendations,
    record_course_interaction,
)

from gemini_service import (
    generate_advisor_response
)

# AI CHAT RATE LIMIT

CHAT_MAX_LENGTH = 2000
CHAT_MIN_INTERVAL = 3.0

_chat_last_request = {}


# CODING STARTER CODE

def get_code_starters(problem, language):
    """
    Return starter code for supported languages.

    Supported languages:
        - Python
        - JavaScript
        - Java
        - C

    The starter code contains the problem context but
    does not contain the complete solution.
    """

    problem_id = str(
        problem.get("id", "")
    ).lower()

    language = str(
        language or ""
    ).strip().lower()

    # PYTHON

    if language == "python":

        starters = {

            
            # P1 — TWO SUM
            

            "p1": '''# Two Sum
            # Return the indices of the two numbers
            # that add up to target.

            nums = test_input.get("nums", [])
            target = test_input.get("target")

            # Write your solution here.
            result = []
            ''',

            
            # P2 — REVERSE STRING
            

            "p2": '''# Reverse String
            # Reverse the given character array.

            s = test_input.get("s", [])

            # Write your solution here.
            result = []
            ''',

            
            # P3 — FIZZBUZZ
            

            "p3": '''# FizzBuzz
            # Return the FizzBuzz sequence from 1 to n.

            n = test_input.get("n", 0)

            # Write your solution here.
            result = []
            ''',

            
            # P4 — PALINDROME NUMBER
            

            "p4": '''# Palindrome Number
            # Determine whether x reads the same
            # backward as forward.

            x = test_input.get("x")

            # Write your solution here.
            result = False
            ''',

            
            # P5 — VALID PARENTHESES
            

            "p5": '''# Valid Parentheses
            # Determine whether the brackets in s are valid.

            s = test_input.get("s", "")

            # Write your solution here.
            result = False
            ''',
        }

        return starters.get(
            problem_id,
            '''# Write your solution below.
            #
            # The test input is available in:
            # test_input
            #
            # Store your final answer in:
            # result

            result = None
            '''
        )

    # JAVASCRIPT

    if language == "javascript":

        starters = {

            
            # P1 — TWO SUM
            

            "p1": '''// Two Sum
            // Return the indices of the two numbers
            // that add up to target.

            const nums = testInput.nums || [];
            const target = testInput.target;

            // Write your solution here.
            let result = [];
            ''',

            
            # P2 — REVERSE STRING
            

            "p2": '''// Reverse String
            // Reverse the given character array.

            const s = testInput.s || [];

            // Write your solution here.
            let result = [];
            ''',

            
            # P3 — FIZZBUZZ
            

            "p3": '''// FizzBuzz
            // Return the FizzBuzz sequence from 1 to n.

            const n = testInput.n || 0;

            // Write your solution here.
            let result = [];
            ''',

            
            # P4 — PALINDROME NUMBER
            

            "p4": '''// Palindrome Number
            // Determine whether x reads the same
            // backward as forward.

            const x = testInput.x;

            // Write your solution here.
            let result = false;
            ''',

            
            # P5 — VALID PARENTHESES
            

            "p5": '''// Valid Parentheses
            // Determine whether the brackets in s are valid.

            const s = testInput.s || "";

            // Write your solution here.
            let result = false;
            ''',
        }

        return starters.get(
            problem_id,
            '''// Write your solution below.
            //
            // The test input is available in:
            // testInput
            //
            // Store your final answer in:
            // result

            let result = null;
            '''
        )

    # JAVA

    if language == "java":

        starters = {

            
            # P1 — TWO SUM
            

            "p1": '''import java.util.*;

            public class Main {

                public static void main(String[] args) {

                    /*
                    * Two Sum
                    *
                    * Return the indices of the two numbers
                    * that add up to target.
                    */

                    // Write your solution here.

                    int[] result = {};

                    System.out.println(
                        Arrays.toString(result)
                    );
                }
            }
            ''',

            
            # P2 — REVERSE STRING
            

            "p2": '''import java.util.*;

            public class Main {

                public static void main(String[] args) {

                    /*
                    * Reverse String
                    *
                    * Reverse the given character array.
                    */

                    // Write your solution here.

                    String result = "";

                    System.out.println(result);
                }
            }
            ''',

            
            # P3 — FIZZBUZZ
            

            "p3": '''import java.util.*;

            public class Main {

                public static void main(String[] args) {

                    /*
                    * FizzBuzz
                    *
                    * Return the FizzBuzz sequence
                    * from 1 to n.
                    */

                    // Write your solution here.

                    List<String> result =
                        new ArrayList<>();

                    System.out.println(result);
                }
            }
            ''',

            
            # P4 — PALINDROME NUMBER
            

            "p4": '''import java.util.*;

            public class Main {

                public static void main(String[] args) {

                    /*
                    * Palindrome Number
                    *
                    * Determine whether x reads the same
                    * backward as forward.
                    */

                    int x = 0;

                    // Write your solution here.

                    boolean result = false;

                    System.out.println(result);
                }
            }
            ''',

            
            # P5 — VALID PARENTHESES
            

            "p5": '''import java.util.*;

            public class Main {

                public static void main(String[] args) {

                    /*
                    * Valid Parentheses
                    *
                    * Determine whether the brackets
                    * in s are valid.
                    */

                    String s = "";

                    // Write your solution here.

                    boolean result = false;

                    System.out.println(result);
                }
            }
            ''',
        }

        return starters.get(
            problem_id,
            '''import java.util.*;

            public class Main {

                public static void main(String[] args) {

                    // Write your solution here.

                }
            }
            '''
        )

    # C

    if language == "c":

        starters = {

            
            # P1 — TWO SUM
            

            "p1": '''#include <stdio.h>

            int main() {

                /*
                * Two Sum
                *
                * Return the indices of the two numbers
                * that add up to target.
                */

                // Write your solution here.

                return 0;
            }
            ''',

            
            # P2 — REVERSE STRING
            

            "p2": '''#include <stdio.h>

            int main() {

                /*
                * Reverse String
                *
                * Reverse the given character array.
                */

                // Write your solution here.

                return 0;
            }
            ''',

            
            # P3 — FIZZBUZZ
            

            "p3": '''#include <stdio.h>

            int main() {

                /*
                * FizzBuzz
                *
                * Return the FizzBuzz sequence
                * from 1 to n.
                */

                // Write your solution here.

                return 0;
            }
            ''',

            
            # P4 — PALINDROME NUMBER
            

            "p4": '''#include <stdio.h>

            int main() {

                /*
                * Palindrome Number
                *
                * Determine whether x reads the same
                * backward as forward.
                */

                int x = 0;

                // Write your solution here.

                int result = 0;

                printf("%d", result);

                return 0;
            }
            ''',

            
            # P5 — VALID PARENTHESES
            

            "p5": '''#include <stdio.h>

            int main() {

                /*
                * Valid Parentheses
                *
                * Determine whether the brackets
                * in s are valid.
                */

                // Write your solution here.

                int result = 0;

                printf("%d", result);

                return 0;
            }
            ''',
        }

        return starters.get(
            problem_id,
            '''#include <stdio.h>

            int main() {

                /*
                * Write your solution here.
                */

                return 0;
            }
            '''
        )

    # FALLBACK

    return ""


# AUTHENTICATION

@app.route("/", endpoint="index")
@login_required
def home():

    saved_course_records = (
        UserCourse.query
        .filter_by(user_id=current_user.id)
        .order_by(UserCourse.saved_date.desc())
        .all()
    )

    all_courses = load_course_data()

    course_lookup = {
        str(course.get("id")): course
        for course in all_courses
    }

    saved_courses = []

    for saved in saved_course_records:

        course = course_lookup.get(
            str(saved.course_id)
        )

        if course:

            saved.course = course

            saved_courses.append(saved)

    submissions = (
        CodeSubmission.query
        .filter_by(user_id=current_user.id)
        .order_by(
            CodeSubmission.submitted_date.desc()
        )
        .all()
    )

    aptitude_results = (
        AptitudeResult.query
        .filter_by(user_id=current_user.id)
        .order_by(
            AptitudeResult.completed_date.desc()
        )
        .all()
    )

    recommendations = []

    try:

        recommendations = get_recommendations(
            current_user,
            limit=3
        )

    except Exception:

        app.logger.exception(
            "Dashboard recommendation error"
        )

    return render_template(
        "index.html",
        title="Dashboard | Career Compass",
        saved_courses=saved_courses,
        submissions=submissions,
        aptitude_results=aptitude_results,
        recommendations=recommendations
    )

@app.route(
    "/register",
    methods=["GET", "POST"]
)
def register():

    
    # Already logged in
    

    if current_user.is_authenticated:

        return redirect(
            url_for("index")
        )

    form = RegistrationForm()

    
    # Registration
    

    if form.validate_on_submit():

        user = User(
            username=form.username.data.strip(),
            email=form.email.data.strip().lower()
        )

        user.set_password(
            form.password.data
        )

        db.session.add(user)

        db.session.commit()

        flash(
            "Your account has been created successfully. "
            "You can now log in.",
            "success"
        )

        return redirect(
            url_for("login")
        )

    return render_template(
        "register.html",
        title="Create Account | Career Compass",
        form=form
    )


# LOGIN

@app.route(
    "/login",
    methods=["GET", "POST"]
)
def login():

    
    # Already logged in
    

    if current_user.is_authenticated:

        return redirect(
            url_for("index")
        )

    form = LoginForm()

    
    # Login validation
    

    if form.validate_on_submit():

        email = (
            form.email.data
            .strip()
            .lower()
        )

        user = (
            User.query
            .filter_by(
                email=email
            )
            .first()
        )

        if user and user.check_password(
            form.password.data
        ):

            login_user(user)

            
            # Safe redirect
            

            next_page = request.args.get(
                "next"
            )

            flash(
                "Welcome back! You have logged in successfully.",
                "success"
            )

            if (
                next_page
                and next_page.startswith("/")
            ):

                return redirect(
                    next_page
                )

            return redirect(
                url_for("index")
            )

        
        # Invalid credentials
        

        flash(
            "Login unsuccessful. Please check your email "
            "and password.",
            "danger"
        )

    return render_template(
        "login.html",
        title="Login | Career Compass",
        form=form
    )


# LOGOUT

@app.route("/logout")
def logout():

    logout_user()

    flash(
        "You have been logged out successfully.",
        "info"
    )

    return redirect(
        url_for("login")
    )


# PROFILE

@app.route("/profile")
@login_required
def profile():

    skills = current_user.get_skills()

    # APTITUDE RESULTS

    aptitude_results = (
        AptitudeResult.query
        .filter_by(
            user_id=current_user.id
        )
        .all()
    )

    # CODE SUBMISSIONS

    code_submissions = (
        CodeSubmission.query
        .filter_by(
            user_id=current_user.id
        )
        .all()
    )

    # SAVED COURSES

    saved_courses = (
        UserCourse.query
        .filter_by(
            user_id=current_user.id
        )
        .all()
    )

    courses_data = load_course_data()

    saved_course_details = []

    for saved in saved_courses:

        for course in courses_data:

            if course["id"] == saved.course_id:

                saved_course_details.append(
                    course
                )

                break

    return render_template(
        "profile.html",
        title="My Profile",
        skills=skills,
        aptitude_results=aptitude_results,
        submissions=code_submissions,
        saved_courses=saved_course_details
    )


# EDIT PROFILE

@app.route(
    "/profile/edit",
    methods=["GET", "POST"]
)
@login_required
def edit_profile():

    form = UpdateProfileForm()

    skills_form = SkillsForm()

    # PRE-FILL

    if request.method == "GET":

        form.username.data = (
            current_user.username
        )

        form.email.data = (
            current_user.email
        )

        form.date_of_birth.data = (
            current_user.date_of_birth
        )

        form.academic_domain.data = (
            current_user.academic_domain
        )

        form.specialization.data = (
            current_user.specialization
        )

        form.sports_achievements.data = (
            current_user.sports_achievements
        )

        form.extracurricular.data = (
            current_user.extracurricular
        )

        form.hobbies.data = (
            current_user.hobbies
        )

        skills = current_user.get_skills()

        if skills:

            for field in skills_form:

                if (
                    field.name in skills
                    and field.name not in {
                        "submit",
                        "csrf_token",
                    }
                ):

                    field.data = (
                        skills[field.name]
                    )

    # PROFILE UPDATE

    if form.validate_on_submit():

        
        # Username
        

        if (
            form.username.data
            != current_user.username
        ):

            user = (
                User.query
                .filter_by(
                    username=form.username.data
                )
                .first()
            )

            if user:

                flash(
                    "Username already taken.",
                    "danger"
                )

                return render_template(
                    "edit_profile.html",
                    title="Edit Profile",
                    form=form,
                    skills_form=skills_form
                )

        
        # Email
        

        if (
            form.email.data
            != current_user.email
        ):

            user = (
                User.query
                .filter_by(
                    email=form.email.data
                )
                .first()
            )

            if user:

                flash(
                    "Email already registered.",
                    "danger"
                )

                return render_template(
                    "edit_profile.html",
                    title="Edit Profile",
                    form=form,
                    skills_form=skills_form
                )

        
        # Save profile
        

        current_user.username = (
            form.username.data
        )

        current_user.email = (
            form.email.data
        )

        current_user.date_of_birth = (
            form.date_of_birth.data
        )

        current_user.academic_domain = (
            form.academic_domain.data
        )

        current_user.specialization = (
            form.specialization.data
        )

        current_user.sports_achievements = (
            form.sports_achievements.data
        )

        current_user.extracurricular = (
            form.extracurricular.data
        )

        current_user.hobbies = (
            form.hobbies.data
        )

        
        # Profile photo
        

        if form.profile_photo.data:

            filename = save_profile_photo(
                form.profile_photo.data
            )

            if filename:

                current_user.profile_photo = (
                    filename
                )

        
        # Skills
        

        skills = {}

        for field in skills_form:

            if field.name not in {
                "submit",
                "csrf_token",
            }:

                skills[field.name] = (
                    field.data
                )

        current_user.set_skills(
            skills
        )

        db.session.commit()

        flash(
            "Your profile has been updated!",
            "success"
        )

        return redirect(
            url_for("profile")
        )

    return render_template(
        "edit_profile.html",
        title="Edit Profile",
        form=form,
        skills_form=skills_form
    )


# AI ADVISOR

@app.route(
    "/ai-advisor",
    methods=["GET", "POST"]
)
@login_required
def ai_advisor():

    form = ChatForm()

    chat_history = (
        ChatHistory.query
        .filter_by(
            user_id=current_user.id
        )
        .order_by(
            ChatHistory.timestamp.desc()
        )
        .limit(10)
        .all()
    )

    if form.validate_on_submit():

        message = form.message.data

        user_context = f"""
User: {current_user.username}
Academic Domain: {
    current_user.academic_domain
    or "Not specified"
}
Specialization: {
    current_user.specialization
    or "Not specified"
}
Skills: {
    ", ".join(
        [
            f"{k}:{v}/5"
            for k, v
            in current_user.get_skills().items()
        ]
    )
}
"""

        response = get_gemini_response(
            message,
            user_context
        )

        chat = ChatHistory(
            user_id=current_user.id,
            message=message,
            response=response
        )

        db.session.add(chat)

        db.session.commit()

        chat_history = (
            ChatHistory.query
            .filter_by(
                user_id=current_user.id
            )
            .order_by(
                ChatHistory.timestamp.desc()
            )
            .limit(10)
            .all()
        )

        return render_template(
            "ai_advisor.html",
            title="AI Advisor",
            form=form,
            chat_history=chat_history
        )

    return render_template(
        "ai_advisor.html",
        title="AI Advisor",
        form=form,
        chat_history=chat_history
    )


# LEGACY API CHAT

@app.route(
    "/api/chat",
    methods=["POST"]
)
@login_required
def api_chat():

    # VALIDATE JSON

    if not request.is_json:

        return jsonify({
            "success": False,
            "error": "JSON request required."
        }), 415

    data = request.get_json(
        silent=True
    )

    if not isinstance(
        data,
        dict
    ):

        return jsonify({
            "success": False,
            "error": "Invalid request."
        }), 400

    # GET MESSAGE

    message = data.get(
        "message",
        ""
    )

    if not isinstance(
        message,
        str
    ):

        return jsonify({
            "success": False,
            "error": "Message must be text."
        }), 400

    message = message.strip()

    # EMPTY MESSAGE

    if not message:

        return jsonify({
            "success": False,
            "error": "Message is required."
        }), 400

    # MESSAGE LENGTH

    if len(message) > CHAT_MAX_LENGTH:

        return jsonify({
            "success": False,
            "error": (
                "Message is too long. "
                "Please keep it within 2000 characters."
            )
        }), 400

    # THROTTLE

    now = time.monotonic()

    last_request = _chat_last_request.get(
        current_user.id
    )

    if (
        last_request is not None
        and now - last_request
        < CHAT_MIN_INTERVAL
    ):

        return jsonify({
            "success": False,
            "error": (
                "Please wait a few seconds "
                "before sending another message."
            )
        }), 429

    _chat_last_request[
        current_user.id
    ] = now

    # USER CONTEXT

    try:

        skills = (
            current_user.get_skills()
            or {}
        )

    except Exception:

        skills = {}

    skill_text = ", ".join(
        f"{key}: {value}/5"
        for key, value
        in skills.items()
    )

    user_context = {

        "username":
            current_user.username,

        "academic_domain":
            current_user.academic_domain
            or "Not specified",

        "specialization":
            current_user.specialization
            or "Not specified",

        "skills":
            skills,

        "skill_summary":
            skill_text
            or "No skills added",
    }

    # PREVIOUS CHATS

    previous_chats = (
        ChatHistory.query
        .filter_by(
            user_id=current_user.id
        )
        .order_by(
            ChatHistory.timestamp.desc()
        )
        .limit(10)
        .all()
    )

    previous_chats.reverse()

    conversation_history = []

    for chat in previous_chats:

        conversation_history.append({
            "role": "user",
            "content": chat.message
        })

        conversation_history.append({
            "role": "assistant",
            "content": chat.response
        })

    # GENERATE RESPONSE

    try:

        response = generate_advisor_response(
            message=message,
            user_context=user_context,
            conversation_history=conversation_history
        )

        if not response:

            return jsonify({
                "success": False,
                "error": (
                    "Compass AI did not "
                    "return a response."
                )
            }), 503

        
        # SAVE CHAT
        

        chat = ChatHistory(
            user_id=current_user.id,
            message=message,
            response=response
        )

        db.session.add(chat)

        db.session.commit()

        return jsonify({
            "success": True,
            "response": response
        })

    except Exception:

        db.session.rollback()

        app.logger.exception(
            "Legacy API chat failed"
        )

        return jsonify({
            "success": False,
            "error": (
                "Compass AI is temporarily unavailable."
            )
        }), 503


# CAREER PATH

@app.route("/career-path")
@login_required
def career_path():

    courses = load_course_data()

    domain = current_user.academic_domain

    skills = current_user.get_skills()

    recommended_courses = []

    if domain:

        for course in courses:

            if (
                course.get("domain") == domain
                or domain in course.get(
                    "related_domains",
                    []
                )
            ):

                recommended_courses.append(
                    course
                )

    else:

        recommended_courses = courses[:5]

    return render_template(
        "career_path.html",
        title="Career Path",
        courses=recommended_courses
    )


# COURSES

@app.route("/courses")
@login_required
def courses():

    # LOAD COURSES

    all_courses = load_course_data()

    if not isinstance(
        all_courses,
        list
    ):

        all_courses = []

    # DOMAIN FILTER

    domain_filter = request.args.get(
        "domain",
        ""
    ).strip().lower()

    filtered_courses = []

    if domain_filter:

        for course in all_courses:

            if not isinstance(
                course,
                dict
            ):

                continue

            main_domain = str(
                course.get(
                    "domain",
                    ""
                )
            ).strip().lower()

            related_domains = course.get(
                "related_domains",
                []
            )

            if isinstance(
                related_domains,
                str
            ):

                related_domains = [
                    item.strip()
                    for item in related_domains.split(",")
                    if item.strip()
                ]

            related_domains = [
                str(domain)
                .strip()
                .lower()
                for domain in related_domains
            ]

            if (
                main_domain == domain_filter
                or domain_filter in related_domains
            ):

                filtered_courses.append(
                    course
                )

    else:

        filtered_courses = all_courses

    # BUILD DOMAIN LIST

    domain_set = set()

    for course in all_courses:

        if not isinstance(
            course,
            dict
        ):

            continue

        domain = course.get(
            "domain",
            ""
        )

        if domain:

            domain_set.add(
                str(domain).strip()
            )

        related_domains = course.get(
            "related_domains",
            []
        )

        if isinstance(
            related_domains,
            str
        ):

            related_domains = [
                item.strip()
                for item in related_domains.split(",")
                if item.strip()
            ]

        for related_domain in related_domains:

            if related_domain:

                domain_set.add(
                    str(related_domain).strip()
                )

    domains = sorted(
        domain_set,
        key=lambda value: value.lower()
    )

    # RENDER

    return render_template(
        "courses.html",
        title="Courses",
        courses=filtered_courses,
        domains=domains,
        selected_domain=domain_filter
    )


# SAVE COURSE

@app.route(
    "/save-course/<course_id>",
    methods=["POST"]
)
@login_required
def save_course(course_id):

    existing = (
        UserCourse.query
        .filter_by(
            user_id=current_user.id,
            course_id=course_id
        )
        .first()
    )

    if existing:

        flash(
            "This course is already saved "
            "to your profile.",
            "info"
        )

    else:

        user_course = UserCourse(
            user_id=current_user.id,
            course_id=course_id
        )

        db.session.add(
            user_course
        )

        db.session.commit()

        record_course_interaction(
            user_id=current_user.id,
            course_id=course_id,
            interaction_type="save"
        )

        flash(
            "Course saved to your profile successfully!",
            "success"
        )

    return redirect(
        url_for("courses")
    )


# REMOVE COURSE

@app.route(
    "/remove-course/<course_id>",
    methods=["POST"]
)
@login_required
def remove_course(course_id):

    course = (
        UserCourse.query
        .filter_by(
            user_id=current_user.id,
            course_id=course_id
        )
        .first()
    )

    if course:

        db.session.delete(
            course
        )

        db.session.commit()

        flash(
            "Course removed from your profile.",
            "success"
        )

    else:

        flash(
            "Course not found in your saved courses.",
            "warning"
        )

    return redirect(
        url_for("profile")
    )


# APTITUDE TESTS

@app.route("/aptitude-test")
@login_required
def aptitude_test():

    test_types = {

        "logical":
            "Logical Reasoning",

        "verbal":
            "Verbal Ability",

        "quantitative":
            "Quantitative Aptitude",

        "technical":
            "Technical Knowledge",
    }

    completed_tests = (
        AptitudeResult.query
        .filter_by(
            user_id=current_user.id
        )
        .all()
    )

    completed_test_types = [
        test.test_type
        for test in completed_tests
    ]

    return render_template(
        "aptitude_test.html",
        title="Aptitude Tests",
        test_types=test_types,
        completed_tests=completed_tests
    )


# TAKE APTITUDE TEST

@app.route(
    "/aptitude-test/<test_type>",
    methods=["GET", "POST"]
)
@login_required
def take_aptitude_test(test_type):

    questions = (
        load_aptitude_questions()
        .get(
            test_type,
            []
        )
    )

    if not questions:

        flash(
            "Test not found or questions unavailable.",
            "danger"
        )

        return redirect(
            url_for("aptitude_test")
        )

    if request.method == "POST":

        score = 0

        for question in questions:

            question_id = str(
                question["id"]
            )

            if question_id in request.form:

                if (
                    request.form[question_id]
                    == question["correct_answer"]
                ):

                    score += 1

        max_score = len(
            questions
        )

        result = AptitudeResult(
            user_id=current_user.id,
            test_type=test_type,
            score=score,
            max_score=max_score
        )

        db.session.add(
            result
        )

        db.session.commit()

        flash(
            f"Test completed! "
            f"Your score: {score}/{max_score}",
            "success"
        )

        return redirect(
            url_for("aptitude_test")
        )

    return render_template(
        "take_aptitude_test.html",
        title=(
            f"Take "
            f"{test_type.capitalize()} Test"
        ),
        questions=questions,
        test_type=test_type
    )


# CODING PRACTICE — PROBLEM LIST

@app.route("/coding-practice")
@login_required
def coding_practice():

    problems = load_coding_problems()

    # COMPLETED PROBLEMS

    completed = (
        CodeSubmission.query
        .filter_by(
            user_id=current_user.id,
            status="Accepted"
        )
        .all()
    )

    completed_ids = {
        str(submission.problem_id)
        for submission in completed
    }

    # NORMALIZE PROBLEMS

    for problem in problems:

        problem_id = str(
            problem.get(
                "id",
                ""
            )
        )

        problem["completed"] = (
            problem_id in completed_ids
        )

        if not problem.get(
            "topic"
        ):

            problem["topic"] = "General"

    # PROGRESS

    solved_count = sum(
        1
        for problem in problems
        if problem.get("completed")
    )

    total_count = len(
        problems
    )

    progress_percentage = (

        round(
            (
                solved_count
                / total_count
            ) * 100,
            1
        )

        if total_count

        else 0
    )

    # RECENT SUBMISSIONS

    recent_submissions = (
        CodeSubmission.query
        .filter_by(
            user_id=current_user.id
        )
        .order_by(
            CodeSubmission.submitted_date.desc()
        )
        .limit(6)
        .all()
    )

    # TOPICS

    topics = sorted({

        str(
            problem.get(
                "topic",
                "General"
            )
        )

        for problem in problems

    })

    # RENDER

    return render_template(
        "coding_practice.html",
        title="Coding Practice",
        problems=problems,
        solved_count=solved_count,
        total_count=total_count,
        progress_percentage=progress_percentage,
        recent_submissions=recent_submissions,
        topics=topics
    )


# CODING PRACTICE — SOLVE PROBLEM

@app.route(
    "/coding-practice/<problem_id>",
    methods=["GET", "POST"]
)
@login_required
def solve_problem(problem_id):

    # LOAD PROBLEMS

    problems = load_coding_problems()

    problem = next(
        (
            item
            for item in problems
            if str(
                item.get("id")
            ) == str(problem_id)
        ),
        None
    )

    # PROBLEM NOT FOUND

    if not problem:

        flash(
            "Problem not found.",
            "danger"
        )

        return redirect(
            url_for("coding_practice")
        )

    # DEFAULT TOPIC

    problem["topic"] = problem.get(
        "topic",
        "General"
    )

    # FORM

    form = CodeSubmissionForm()

    # SUPPORTED LANGUAGES
    #
    # Only these four languages are supported:
    #
    # Python → JavaScript → Java → C
    #
    # SQL has been completely removed.
    #

    supported_languages = [
        "python",
        "javascript",
        "java",
        "c",
    ]

    # STARTER CODE
    #
    # Every problem receives separate starter code
    # for every supported language.
    #
    # Example:
    #
    # p2
    # ├── python
    # ├── javascript
    # ├── java
    # └── c
    #

    starter_codes = {

        language: get_code_starters(
            problem,
            language
        )

        for language
        in supported_languages
    }

    # DEFAULT VALUES

    result = None

    action = "submit"

    # GET REQUEST

    if request.method == "GET":

        form.language.data = "python"

        form.code.data = (
            starter_codes.get(
                "python",
                ""
            )
        )

        form.action.data = "submit"

    # FORM SUBMISSION

    if form.validate_on_submit():

        
        # CODE
        

        code = (
            form.code.data or ""
        ).strip()

        
        # LANGUAGE
        

        language = (
            form.language.data or ""
        ).strip().lower()

        
        # ACTION
        

        action = (
            form.action.data or "submit"
        ).strip().lower()

        
        # CODE LENGTH
        

        if len(code) > 12000:

            flash(
                "Code must be 12000 characters or fewer.",
                "danger"
            )

            return render_template(
                "solve_problem.html",
                title=problem["title"],
                problem=problem,
                form=form,
                result=None,
                action=action,
                starter_codes=starter_codes,
                previous_submissions=[]
            )

        
        # LANGUAGE VALIDATION
        

        if language not in supported_languages:

            flash(
                "Unsupported programming language.",
                "danger"
            )

            return render_template(
                "solve_problem.html",
                title=problem["title"],
                problem=problem,
                form=form,
                result=None,
                action=action,
                starter_codes=starter_codes,
                previous_submissions=[]
            )

        
        # RUN COMPILER
        

        try:

            result = compile_and_run(
                code,
                language,
                problem.get(
                    "test_cases",
                    []
                )
            )

        except Exception as exc:

            app.logger.exception(
                "Code execution failed"
            )

            result = {

                "passed": False,

                "error": True,

                "message":
                    "Code execution failed.",

                "error_message":
                    str(exc),

                "passed_tests":
                    0,

                "total_tests":
                    len(
                        problem.get(
                            "test_cases",
                            []
                        )
                    ),
            }

        
        # NORMALIZE RESULT
        

        if not isinstance(
            result,
            dict
        ):

            result = {

                "passed": False,

                "error": True,

                "message":
                    "Invalid compiler response.",

                "error_message":
                    "The compiler returned an invalid result.",

                "passed_tests":
                    0,

                "total_tests":
                    len(
                        problem.get(
                            "test_cases",
                            []
                        )
                    ),
            }

        
        # DETERMINE STATUS
        

        if result.get(
            "error",
            False
        ):

            status = "Runtime Error"

        elif result.get(
            "passed",
            False
        ):

            status = "Accepted"

        else:

            status = "Wrong Answer"

        
        # RUN ONLY
        

        if action == "run":

            if result.get(
                "passed",
                False
            ):

                flash(
                    "All test cases passed.",
                    "success"
                )

            elif result.get(
                "error",
                False
            ):

                flash(
                    "Code execution failed. "
                    "Check the error details below.",
                    "danger"
                )

            else:

                flash(
                    "Code executed. "
                    "Check the test results below.",
                    "warning"
                )

        
        # SUBMIT
        

        else:

            try:

                submission = CodeSubmission(

                    user_id=current_user.id,

                    problem_id=str(
                        problem_id
                    ),

                    code=code,

                    language=language,

                    status=status
                )

                db.session.add(
                    submission
                )

                db.session.commit()

            except Exception:

                db.session.rollback()

                app.logger.exception(
                    "Unable to save code submission"
                )

                flash(
                    "Your code ran, but the "
                    "submission could not be saved.",
                    "warning"
                )

            
            # USER MESSAGE
            

            if status == "Accepted":

                flash(
                    (
                        "Accepted — "
                        f"{result.get('passed_tests', 0)}/"
                        f"{result.get('total_tests', 0)} "
                        "tests passed."
                    ),
                    "success"
                )

            elif status == "Runtime Error":

                flash(
                    "Runtime Error — "
                    "check your code and try again.",
                    "danger"
                )

            else:

                flash(
                    (
                        "Wrong Answer — "
                        f"{result.get('passed_tests', 0)}/"
                        f"{result.get('total_tests', 0)} "
                        "tests passed."
                    ),
                    "warning"
                )

        
        # PREVIOUS SUBMISSIONS
        

        previous_submissions = (
            CodeSubmission.query
            .filter_by(
                user_id=current_user.id,
                problem_id=str(
                    problem_id
                )
            )
            .order_by(
                CodeSubmission.submitted_date.desc()
            )
            .limit(8)
            .all()
        )

        
        # RENDER RESULT
        

        return render_template(
            "solve_problem.html",
            title=problem["title"],
            problem=problem,
            form=form,
            result=result,
            action=action,
            starter_codes=starter_codes,
            previous_submissions=previous_submissions
        )

    # PREVIOUS SUBMISSIONS — INITIAL PAGE

    previous_submissions = (
        CodeSubmission.query
        .filter_by(
            user_id=current_user.id,
            problem_id=str(
                problem_id
            )
        )
        .order_by(
            CodeSubmission.submitted_date.desc()
        )
        .limit(8)
        .all()
    )

    # INITIAL PAGE

    return render_template(
        "solve_problem.html",
        title=problem["title"],
        problem=problem,
        form=form,
        result=result,
        action=action,
        starter_codes=starter_codes,
        previous_submissions=previous_submissions
    )

# COLLABORATIVE FILTERING RECOMMENDATIONS

@app.route(
    "/recommendations"
)
@login_required
def recommendations():

    recommendations_data = (
        get_recommendations(
            current_user,
            limit=8
        )
    )

    return render_template(
        "recommendations.html",
        title="Recommended For You",
        recommendations=recommendations_data
    )

@app.route(
    "/api/recommendations/interaction",
    methods=["POST"]
)
@login_required
def recommendation_interaction():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        course_id = str(
            data.get(
                "course_id",
                ""
            )
        ).strip()

        interaction_type = str(
            data.get(
                "interaction",
                ""
            )
        ).strip().lower()

        allowed_interactions = {
            "view",
            "click",
            "save",
            "started",
            "in_progress",
            "completed"
        }

        if not course_id:

            return jsonify({
                "success": False,
                "error": "Course ID is required."
            }), 400

        if interaction_type not in allowed_interactions:

            return jsonify({
                "success": False,
                "error": "Invalid interaction type."
            }), 400

        courses = load_course_data()

        valid_course = any(
            str(course.get("id")) == course_id
            for course in courses
        )

        if not valid_course:

            return jsonify({
                "success": False,
                "error": "Course not found."
            }), 404

        recorded = record_course_interaction(
            user_id=current_user.id,
            course_id=course_id,
            interaction_type=interaction_type
        )

        if not recorded:

            db.session.rollback()

            return jsonify({
                "success": False,
                "error": "Unable to record interaction."
            }), 500

        return jsonify({
            "success": True,
            "course_id": course_id,
            "interaction": interaction_type
        })

    except Exception:

        db.session.rollback()

        app.logger.exception(
            "Recommendation interaction error"
        )

        return jsonify({
            "success": False,
            "error": "Unable to record interaction."
        }), 500

# ERROR HANDLERS

# 400 — BAD REQUEST

@app.errorhandler(400)
def bad_request_error(error):

    app.logger.warning(
        "400 Bad Request: %s",
        error
    )

    return render_template(
        "400.html"
    ), 400


# 401 — UNAUTHORIZED

@app.errorhandler(401)
def unauthorized_error(error):

    return render_template(
        "401.html"
    ), 401


# 403 — FORBIDDEN

@app.errorhandler(403)
def forbidden_error(error):

    app.logger.warning(
        "403 Forbidden: %s",
        error
    )

    return render_template(
        "403.html"
    ), 403


# 404 — PAGE NOT FOUND

@app.errorhandler(404)
def not_found_error(error):

    app.logger.warning(
        "404 Not Found: %s",
        request.path
    )

    return render_template(
        "404.html"
    ), 404


# 405 — METHOD NOT ALLOWED

@app.errorhandler(405)
def method_not_allowed_error(error):

    app.logger.warning(
        "405 Method Not Allowed: %s %s",
        request.method,
        request.path
    )

    return render_template(
        "405.html"
    ), 405


# 413 — REQUEST ENTITY TOO LARGE

@app.errorhandler(413)
def request_entity_too_large_error(error):

    app.logger.warning(
        "413 Request Too Large: %s",
        request.path
    )

    return render_template(
        "413.html"
    ), 413


# 429 — TOO MANY REQUESTS

@app.errorhandler(429)
def too_many_requests_error(error):

    app.logger.warning(
        "429 Too Many Requests: %s",
        request.path
    )

    return render_template(
        "429.html"
    ), 429


# 500 — INTERNAL SERVER ERROR

@app.errorhandler(500)
def internal_error(error):

    db.session.rollback()

    app.logger.exception(
        "500 Internal Server Error"
    )

    return render_template(
        "500.html"
    ), 500