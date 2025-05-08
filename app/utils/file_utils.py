"""Utility functions for file handling."""

import os
import shutil
from fastapi import UploadFile
from pathlib import Path
from typing import Optional
import uuid


def save_upload_file(upload_file: UploadFile, destination_folder: str, filename: Optional[str] = None) -> str:
    """
    Save an uploaded file to the specified destination folder.
    
    Args:
        upload_file: The uploaded file
        destination_folder: The folder where the file should be saved
        filename: Optional custom filename, if not provided, the original filename will be used
        
    Returns:
        The path to the saved file
    """
    # Create the destination folder if it doesn't exist
    os.makedirs(destination_folder, exist_ok=True)
    
    # Generate a unique filename if not provided
    if not filename:
        # Get the file extension
        _, ext = os.path.splitext(upload_file.filename)
        # Generate a unique filename
        filename = f"{uuid.uuid4()}{ext}"
    
    # Create the full file path
    file_path = os.path.join(destination_folder, filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    # Reset the file pointer
    upload_file.file.seek(0)
    
    return file_path
