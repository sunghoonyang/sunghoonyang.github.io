from flask import render_template, redirect, url_for, send_file

from ghpages.app import app


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/download_cv.pdf')
def download_cv():
    try:
        return send_file('static/asset/cv.pdf',
                         attachment_filename='sunghoonyang_duke_resume.pdf')
    except Exception as e:
        return str(e)
