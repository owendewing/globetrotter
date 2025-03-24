from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import MySQLdb.cursors, re, hashlib
import bcrypt

app = Flask(__name__)
CORS(app)

app.secret_key = 'owendewingglobetrotter'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'odew2003'
app.config['MYSQL_DB'] = 'globetrotter'

MySQL = MySQL(app)

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
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'message': 'Invalid email/username or password!'}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'message': 'An error occurred during login!'}), 500

if __name__ == '__main__':
    app.run(debug=True)