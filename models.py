from datetime import datetime

from flask_login import UserMixin
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from app import db, login_manager

import json


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(UserMixin, db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(64),
        unique=True,
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(256),
        nullable=False
    )

    profile_photo = db.Column(
        db.String(255),
        default="default_profile.jpg"
    )

    date_of_birth = db.Column(
        db.Date,
        nullable=True
    )

    academic_domain = db.Column(
        db.String(120),
        nullable=True
    )

    specialization = db.Column(
        db.String(120),
        nullable=True
    )

    sports_achievements = db.Column(
        db.Text,
        nullable=True
    )

    extracurricular = db.Column(
        db.Text,
        nullable=True
    )

    hobbies = db.Column(
        db.Text,
        nullable=True
    )

    joined_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    skills = db.Column(
        db.Text,
        default="{}"
    )

    # User's saved courses
    courses = db.relationship(
        "UserCourse",
        backref="user",
        lazy=True
    )

    # User's code submissions
    submissions = db.relationship(
        "CodeSubmission",
        backref="user",
        lazy=True
    )

    # User's aptitude test results
    aptitude_results = db.relationship(
        "AptitudeResult",
        backref="user",
        lazy=True
    )

    # User's recommendation interactions
    recommendation_interactions = db.relationship(
        "RecommendationInteraction",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def set_password(self, password):

        self.password_hash = generate_password_hash(
            password
        )

    def check_password(self, password):

        return check_password_hash(
            self.password_hash,
            password
        )

    def set_skills(self, skills_dict):

        self.skills = json.dumps(
            skills_dict
        )

    def get_skills(self):

        try:

            return json.loads(
                self.skills
            )

        except Exception:

            return {}


class UserCourse(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    course_id = db.Column(
        db.String(64),
        nullable=False
    )

    saved_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )


class CodeSubmission(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    problem_id = db.Column(
        db.String(64),
        nullable=False
    )

    code = db.Column(
        db.Text,
        nullable=False
    )

    language = db.Column(
        db.String(50),
        nullable=False
    )

    status = db.Column(
        db.String(50),
        nullable=False
    )

    submitted_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


class AptitudeResult(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    test_type = db.Column(
        db.String(100),
        nullable=False
    )

    score = db.Column(
        db.Integer,
        nullable=False
    )

    max_score = db.Column(
        db.Integer,
        nullable=False
    )

    completed_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def get_percentage(self):

        return (
            self.score / self.max_score
        ) * 100 if self.max_score > 0 else 0


class ChatHistory(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    response = db.Column(
        db.Text,
        nullable=False
    )

    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


class RecommendationInteraction(db.Model):

    __tablename__ = "recommendation_interactions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False,
        index=True
    )

    item_id = db.Column(
        db.String(100),
        nullable=False,
        index=True
    )

    item_type = db.Column(
        db.String(50),
        nullable=False,
        default="course",
        index=True
    )

    interaction_type = db.Column(
        db.String(50),
        nullable=False,
        index=True
    )

    weight = db.Column(
        db.Float,
        nullable=False,
        default=1.0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True
    )

    def __repr__(self):

        return (
            f"<RecommendationInteraction "
            f"user={self.user_id} "
            f"item={self.item_id} "
            f"type={self.interaction_type}>"
        )