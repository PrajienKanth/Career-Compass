import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

# Define allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_profile_photo(file_storage):
    """
    Save a profile photo to the uploads directory.
    
    Args:
        file_storage: The FileStorage instance from the request.
        
    Returns:
        The filename of the saved file.
    """
    if file_storage and allowed_file(file_storage.filename):
        # Generate a unique filename to prevent conflicts
        original_filename = secure_filename(file_storage.filename)
        _, extension = os.path.splitext(original_filename)
        unique_filename = f"{uuid.uuid4().hex}{extension}"
        
        # Make sure the upload directory exists
        upload_path = os.path.join(current_app.root_path, 'static/uploads')
        os.makedirs(upload_path, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(upload_path, unique_filename)
        file_storage.save(file_path)
        
        return unique_filename
    
    return None