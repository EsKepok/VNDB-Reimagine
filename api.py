from flask import Blueprint, request, jsonify
import requests
import json

vn_api = Blueprint('vn_api', __name__)

@vn_api.route('/vn-info')
def get_vn_info():
    query = request.args.get('vn_id')  # bisa id atau nama
    if not query:
        return jsonify({"error": "Missing 'vn_id' parameter"}), 400

    url = "https://api.vndb.org/kana/vn"
    headers = {'Content-Type': 'application/json'}

    # Deteksi apakah input adalah ID (misalnya: v26415)
    if query.startswith('v') and query[1:].isdigit():
        filters = ["id", "=", query]
    else:
        filters = ["search", "=", query]

    data = {
        "filters": filters,
        "fields": "id, title, image.url",
        "results": 10  # ambil maksimal 10 hasil pencarian
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': response.status_code}), response.status_code
