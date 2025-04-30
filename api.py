from flask import Blueprint, request, jsonify
import requests
import json

vn_api = Blueprint('vn_api', __name__)
VNDB_API_URL = "https://api.vndb.org/kana/vn"

@vn_api.route('/vn-info')
def get_vn_info():
    query = request.args.get('vn_id')
    
    # Handle popular VNs request
    if query == 'popular':
        data = {
            "filters": ["rating", ">=", 80],
            "fields": "id, title, aliases, image.url, length, developers.name, description",
            "sort": "popularity",
            "results": 6  # Reduced to 6 for the homepage grid
        }
    else:
        # Handle regular search
        if not query:
            return jsonify({"error": "Missing 'vn_id' parameter"}), 400

        # Determine search type
        if query.startswith('v') and query[1:].isdigit():
            filters = ["id", "=", query]
        else:
            filters = ["search", "=", query]

        data = {
            "filters": filters,
            "fields": "id, title, aliases, image.url, length, developers.name, description",
            "results": 10
        }

    try:
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'VNInfo/1.0'
        }
        
        response = requests.post(
            VNDB_API_URL,
            headers=headers,
            data=json.dumps(data),
            timeout=10  # Add timeout to prevent hanging
        )
        
        # Check for HTTP errors
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        # Handle different types of request exceptions
        error_info = {
            'error': 'Failed to fetch data from VNDB API',
            'details': str(e)
        }
        
        # Add more details if available
        if hasattr(e, 'response') and e.response:
            try:
                error_info['api_error'] = e.response.json()
                error_info['status_code'] = e.response.status_code
            except ValueError:
                error_info['status_code'] = e.response.status_code
        
        return jsonify(error_info), 500