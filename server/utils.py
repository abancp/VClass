import re
from bson import ObjectId

def convert_objectid_to_string(doc):
    """Recursively convert ObjectId to string in a document."""
    if isinstance(doc, list):
        return [convert_objectid_to_string(item) for item in doc]
    elif isinstance(doc, dict):
        return {key: convert_objectid_to_string(value) for key, value in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc
def is_valid_ObjectId(value):
    return isinstance(value,str) and re.fullmatch(r"^[a-fA-F0-9]{24}$",value)
