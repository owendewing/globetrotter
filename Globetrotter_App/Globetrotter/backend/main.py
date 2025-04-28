from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import MySQLdb.cursors, re, hashlib
import bcrypt
import openai
from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from datetime import timedelta


app = Flask(__name__)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['SESSION_COOKIE_HTTPONLY'] = True
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": [
            "http://127.0.0.1:5000",
            "http://localhost:5000",
            "exp://192.168.1.217:8081",
            "http://192.168.1.217:8081",
        ],
        "allow_headers": ["Content-Type", "Authorization", "Cookie"],
        "allow_methods": ["GET", "POST", "PUT", "DELETE"],
        "expose_headers": ["Set-Cookie"],
        "supports_credentials": True
    }
}
)

app.secret_key = 'owendewingglobetrotter'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'odew2003'
app.config['MYSQL_DB'] = 'globetrotter'

MySQL = MySQL(app)

load_dotenv()

@app.route('/register', methods=['POST'])
def register():
    full_name = request.json['fullname']
    username = request.json['username']
    password = request.json['password']
    email = request.json['email']
    
    try:
        cur = MySQL.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
        existing_user = cur.fetchone()
        
        if existing_user:
            return jsonify({'message': 'Username or email already exists!'}), 400
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        cur.execute("INSERT INTO users(full_name, username, password_hash, email) VALUES(%s, %s, %s, %s)",
                  (full_name, username, hashed_password, email))
        MySQL.connection.commit()
        cur.close()
        
        return jsonify({'message': 'User registered successfully!'}), 201
    
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({'message': 'An error occurred during registration!'}), 500

@app.route('/login', methods=['POST'])
def login():
    identifier = request.json['identifier']
    password = request.json['password']
    
    try:
        cur = MySQL.connection.cursor(MySQLdb.cursors.DictCursor)
        
        if '@' in identifier:
            cur.execute("SELECT * FROM users WHERE email = %s", [identifier])
        else:
            cur.execute("SELECT * FROM users WHERE username = %s", [identifier])
        
        user = cur.fetchone()
        cur.close()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            session['user_id'] = user['id']
            session.permanent = True
            print("Session after login:", session)
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'message': 'Invalid email/username or password!'}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'message': 'An error occurred during login!'}), 500
    
@app.route('/get-current-user', methods=['GET'])
def get_current_user():
    try:
        if 'user_id' not in session:
            return jsonify({'message': 'User not logged in'}), 401

        user_id = session['user_id']
        cur = MySQL.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT id, full_name, username, email FROM users WHERE id = %s", [user_id])
        user = cur.fetchone()
        cur.close()

        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user["id"],
                'full_name': user['full_name'],
                'username': user['username'], 
            }
        }), 200

    except Exception as e:
        print(f"Error fetching user data: {e}")
        return jsonify({'message': 'An error occurred while fetching user data'}), 500

    
@app.route('/generate-itinerary', methods=['POST'])
def generate_itinerary():
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment")

    client = OpenAI(api_key=api_key)

    print("Raw request data:", request.data)
    if not request.is_json:
        print("Request is not JSON")
        return jsonify({'message': 'Missing JSON in request'}), 400
        
    try:
        form_data = request.get_json()
        print("Parsed JSON data:", form_data)
        if not form_data:
            return jsonify({'message': 'No form data provided'}), 400
            
        trip_type = form_data.get('tripType', '')
        trip_length = form_data.get('tripLength', 1)
        departure_date = form_data.get('departureDate', '')
        # weather_pref = form_data.get('weather', '')
        temperature_pref = form_data.get('temperature', '')
        biome_pref = form_data.get('biome', '')
        continents = form_data.get('continents', [])
        avoid_destinations = form_data.get('avoidDestinations', '')

        continent_names = [continent['label'] for continent in continents] if continents else []
        continents_str = ", ".join(continent_names) if continent_names else "Any"

        prompt = f"""
        Generate 3 travel itineraries based on these preferences:

        Trip Type: {trip_type}
        Trip Length: {trip_length} days
        Departure Date: {departure_date}
        Preferred Biome/Environment: {biome_pref}
        Preferred Continents: {continents_str}
        Temperature Preference: {temperature_pref}
        Places to Avoid: {avoid_destinations}

        IMPORTANT: Return ONLY a valid JSON object with this exact structure:
        {{
          "itineraries": [
            {{
              "title": "Itinerary 1 Name",
              "description": "Brief overview of this itinerary",
              "destination": "Main destination",
              "days": [
                {{
                  "day": 1,
                  "location": "City/Area name",
                  "activities": [
                    "Morning: Activity description",
                    "Afternoon: Activity description",
                    "Evening: Activity description"
                  ],
                  "accommodation": "Recommended accommodation type"
                }},
                // Additional days here
              ]
            }},
            // Additional itineraries (total of 3)
          ]
        }}

        DO NOT include any text outside the JSON structure.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a travel planning assistant that creates detailed personalized itineraries in structured JSON format only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=2000
        )
        
        content = response.choices[0].message.content
        
        
        import json
        try:
            itinerary_data = json.loads(content)
            
            if "itineraries" not in itinerary_data or not isinstance(itinerary_data["itineraries"], list):
                raise ValueError("Invalid response structure")
                
            return jsonify({
                'message': 'Itinerary generated successfully',
                'itinerary': itinerary_data
            }), 200
            
        except json.JSONDecodeError:
            print(f"Failed to parse JSON from response: {content}")
            return jsonify({
                'message': 'Failed to generate valid itinerary format',
                'error': 'Invalid JSON response'
            }), 500
            
    except Exception as e:
        print(f"Error generating itinerary: {str(e)}")
        return jsonify({
            'message': 'An error occurred while generating your itinerary',
            'error': str(e)
        }), 500
    
@app.route('/generate-wishlist-itinerary', methods=['POST'])
def generate_wishlist_itinerary():
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment")

    client = OpenAI(api_key=api_key)

    print("Raw request data:", request.data)
    if not request.is_json:
        print("Request is not JSON")
        return jsonify({'message': 'Missing JSON in request'}), 400
        
    try:
        form_data = request.get_json()
        print("Parsed JSON data:", form_data)
        if not form_data:
            return jsonify({'message': 'No form data provided'}), 400
            
        destination = form_data.get('destination', '')    
        trip_type = form_data.get('tripType', '')
        trip_length = form_data.get('tripLength', 1)
        departure_date = form_data.get('departureDate', '')

        prompt = f"""
        Generate 3 travel itineraries based on these preferences:

        Destination: {destination}
        Trip Type: {trip_type}
        Trip Length: {trip_length} days
        Departure Date: {departure_date}

        IMPORTANT: Return ONLY a valid JSON object with this exact structure:
        {{
          "itineraries": [
            {{
              "title": "Itinerary 1 Name",
              "description": "Brief overview of this itinerary",
              "destination": "Main destination",
              "days": [
                {{
                  "day": 1,
                  "location": "City/Area name",
                  "activities": [
                    "Morning: Activity description",
                    "Afternoon: Activity description",
                    "Evening: Activity description"
                  ],
                  "accommodation": "Recommended accommodation type"
                }},
                // Additional days here
              ]
            }},
            // Additional itineraries (total of 3)
          ]
        }}

        DO NOT include any text outside the JSON structure.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a travel planning assistant that creates detailed personalized itineraries in structured JSON format only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=2000
        )
        
        content = response.choices[0].message.content
        
        
        import json
        try:
            itinerary_data = json.loads(content)
            
            if "itineraries" not in itinerary_data or not isinstance(itinerary_data["itineraries"], list):
                raise ValueError("Invalid response structure")
                
            return jsonify({
                'message': 'Itinerary generated successfully',
                'itinerary': itinerary_data
            }), 200
            
        except json.JSONDecodeError:
            print(f"Failed to parse JSON from response: {content}")
            return jsonify({
                'message': 'Failed to generate valid itinerary format',
                'error': 'Invalid JSON response'
            }), 500
            
    except Exception as e:
        print(f"Error generating itinerary: {str(e)}")
        return jsonify({
            'message': 'An error occurred while generating your itinerary',
            'error': str(e)
        }), 500


@app.route('/save-itinerary', methods=["POST"])
def save_itinerary():
    print("Session data:", session)
    if 'user_id' not in session:
        return jsonify({'message': 'User not logged in'}), 401

    user_id = session['user_id']
    itinerary = request.json["itinerary"]
    print("Received itinerary:", itinerary)

    if not itinerary:
        return jsonify({'message': 'No itinerary provided'}), 400

    try:
        cur = MySQL.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("INSERT into saved_itineraries (user_id, title, description, destination) VALUES (%s, %s, %s, %s)",
        (user_id, itinerary['title'], itinerary['description'], itinerary['destination'])
        )
        itinerary_id = cur.lastrowid

        for day in itinerary['days']:
            cur.execute("INSERT into itinerary_days (itinerary_id, day_number, location, activities, accommodation) VALUES (%s, %s, %s, %s, %s)",
            (itinerary_id, day['day'], day['location'], json.dumps(day['activities']), day['accommodation'])
            )
        MySQL.connection.commit()
        cur.close()
        return jsonify({'message': 'Itinerary saved successfully!'}), 201
    except Exception as e:
        print(f"Error saving itinerary: {e}")
        return jsonify({'message': 'An error occurred while saving the itinerary!'}), 500
            

@app.route('/get-saved-itineraries', methods=['GET'])
def get_saved_itineraries():
    try:
        if 'user_id' not in session:
            return jsonify({'message': 'User not logged in'}), 401

        user_id = session['user_id']
        cur = MySQL.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT id, title, description, destination FROM saved_itineraries WHERE user_id = %s", [user_id])
        itineraries = cur.fetchall()
        cur.close()
        if not itineraries:
            return jsonify({'message': 'No saved itineraries found'}), 404
        itinerary_list = []
        for itinerary in itineraries:
            cur = MySQL.connection.cursor(MySQLdb.cursors.DictCursor)
            cur.execute("SELECT day_number, location, activities, accommodation FROM itinerary_days WHERE itinerary_id = %s", [itinerary['id']])
            days = cur.fetchall()
            for day in days:
                try:
                    day['activities'] = json.loads(day['activities'])
                except Exception as e:
                    print(f"Error parsing activities JSON: {e}")
            day['activities'] = []
            itinerary['days'] = days
            itinerary_list.append(itinerary)
        return jsonify({
            'itineraries': itinerary_list
        }), 200
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return jsonify({'message': 'An error occurred while fetching user data'}), 500



@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)