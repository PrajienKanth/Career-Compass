import re
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import (
    DateField,
    HiddenField,
    PasswordField,
    SelectField,
    StringField,
    SubmitField,
    TextAreaField,
)
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError, Optional
from models import User
from datetime import date

# List of allowed image extensions
ALLOWED_IMAGES = ['jpg', 'jpeg', 'png', 'gif']

# AUTHENTICATION FORMS

# REGISTRATION FORM
class RegistrationForm(FlaskForm):

    username = StringField(
        "Username",
        validators=[
            DataRequired(
                message="Please enter a username."
            ),
            Length(
                min=3,
                max=20,
                message="Username must be between 3 and 20 characters."
            )
        ]
    )

    email = StringField(
        "Email",
        validators=[
            DataRequired(
                message="Please enter your email address."
            ),
            Email(
                message="Please enter a valid email address."
            )
        ]
    )

    password = PasswordField(
        "Password",
        validators=[
            DataRequired(
                message="Please enter a password."
            ),
            Length(
                min=8,
                message="Password must contain at least 8 characters."
            )
        ]
    )

    confirm_password = PasswordField(
        "Confirm Password",
        validators=[
            DataRequired(
                message="Please confirm your password."
            ),
            EqualTo(
                "password",
                message="Passwords do not match."
            )
        ]
    )

    submit = SubmitField(
        "Create Account"
    )


    # USERNAME VALIDATION

    def validate_username(self, username):

        username_value = username.data.strip()

        user = User.query.filter_by(
            username=username_value
        ).first()

        if user:

            raise ValidationError(
                "Username is already taken. Please choose another one."
            )


    # EMAIL VALIDATION

    def validate_email(self, email):

        email_value = email.data.strip().lower()

        user = User.query.filter_by(
            email=email_value
        ).first()

        if user:

            raise ValidationError(
                "Email is already registered. Please use another email."
            )


    # PASSWORD SECURITY VALIDATION

    def validate_password(self, password):

        value = password.data or ""

        errors = []


        # Minimum length

        if len(value) < 8:

            errors.append(
                "at least 8 characters"
            )


        # Lowercase

        if not re.search(r"[a-z]", value):

            errors.append(
                "one lowercase letter"
            )


        # Uppercase

        if not re.search(r"[A-Z]", value):

            errors.append(
                "one uppercase letter"
            )


        # Number

        if not re.search(r"\d", value):

            errors.append(
                "one number"
            )


        # Special character

        if not re.search(
            r"[^A-Za-z0-9]",
            value
        ):

            errors.append(
                "one special character"
            )


        # Return validation error

        if errors:

            raise ValidationError(
                "Password must contain "
                + ", ".join(errors)
                + "."
            )

# LOGIN FORM
class LoginForm(FlaskForm):

    email = StringField(
        "Email",
        validators=[
            DataRequired(
                message="Please enter your email address."
            ),
            Email(
                message="Please enter a valid email address."
            )
        ]
    )

    password = PasswordField(
        "Password",
        validators=[
            DataRequired(
                message="Please enter your password."
            )
        ]
    )

    submit = SubmitField(
        "Login"
    )

# UPDATION PROFILE FORM
class UpdateProfileForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    profile_photo = FileField('Update Profile Picture', validators=[FileAllowed(ALLOWED_IMAGES, 'Images only!')])
    date_of_birth = DateField('Date of Birth', format='%Y-%m-%d', validators=[Optional()])
    academic_domain = SelectField('Academic Domain', choices=[
        ('', 'Select Domain'),
        ('computer_science', 'Computer Science & Engineering'),
        ('electrical', 'Electrical Engineering'),
        ('mechanical', 'Mechanical Engineering'),
        ('civil', 'Civil Engineering'),
        ('electronics', 'Electronics & Communication'),
        ('chemical', 'Chemical Engineering'),
        ('biotech', 'Biotechnology'),
        ('aeronautical', 'Aeronautical Engineering'),
        ('other', 'Other')
    ])
    specialization = StringField('Specialization', validators=[Optional(), Length(max=120)])
    sports_achievements = TextAreaField('Sports Achievements', validators=[Optional()])
    extracurricular = TextAreaField('Extracurricular Activities', validators=[Optional()])
    hobbies = TextAreaField('Hobbies & Interests', validators=[Optional()])
    submit = SubmitField('Update Profile')
    
    def validate_date_of_birth(self, date_of_birth):
        if date_of_birth.data:
            if date_of_birth.data > date.today():
                raise ValidationError('Date of birth cannot be in the future')


class SkillsForm(FlaskForm):
    programming = SelectField('Programming', choices=[
        (0, 'Not Proficient'), (1, 'Beginner'), (2, 'Intermediate'), 
        (3, 'Advanced'), (4, 'Expert'), (5, 'Master')
    ], coerce=int)
    data_structures = SelectField('Data Structures', choices=[
        (0, 'Not Proficient'), (1, 'Beginner'), (2, 'Intermediate'), 
        (3, 'Advanced'), (4, 'Expert'), (5, 'Master')
    ], coerce=int)
    algorithms = SelectField('Algorithms', choices=[
        (0, 'Not Proficient'), (1, 'Beginner'), (2, 'Intermediate'), 
        (3, 'Advanced'), (4, 'Expert'), (5, 'Master')
    ], coerce=int)
    database = SelectField('Databases', choices=[
        (0, 'Not Proficient'), (1, 'Beginner'), (2, 'Intermediate'), 
        (3, 'Advanced'), (4, 'Expert'), (5, 'Master')
    ], coerce=int)
    web_development = SelectField('Web Development', choices=[
        (0, 'Not Proficient'), (1, 'Beginner'), (2, 'Intermediate'), 
        (3, 'Advanced'), (4, 'Expert'), (5, 'Master')
    ], coerce=int)
    machine_learning = SelectField('Machine Learning', choices=[
        (0, 'Not Proficient'), (1, 'Beginner'), (2, 'Intermediate'), 
        (3, 'Advanced'), (4, 'Expert'), (5, 'Master')
    ], coerce=int)
    submit = SubmitField('Update Skills')


class ChatForm(FlaskForm):
    message = TextAreaField('Message', validators=[DataRequired()])
    submit = SubmitField('Send')


# CODE SUBMISSION FORM
class CodeSubmissionForm(FlaskForm):

    language = SelectField(
        "Language",
        choices=[
            ("python", "Python"),
            ("javascript", "JavaScript"),
            ("java", "Java"),
            ("c", "C"),
        ],
        validators=[
            DataRequired(
                message="Please select a language."
            )
        ],
    )

    code = TextAreaField(
        "Your Code",
        validators=[
            DataRequired(
                message="Please enter your code."
            ),
            Length(
                max=12000,
                message="Code must be 12000 characters or fewer."
            ),
        ],
    )

    action = HiddenField(
        "Action",
        default="submit"
    )

    submit = SubmitField(
        "Submit Solution"
    )