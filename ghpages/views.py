from flask import render_template, redirect, url_for, send_file, request
from ghpages.app import app
# for gallery-in-jupyter github markdown import
import markdown
from flask import Markup


@app.route('/')
def home():
    gallery_type, gallery_content = '', ''
    if 'gallery_type' in request.args.keys():
        gallery_type = request.args.get('gallery_type')
    if gallery_type == 'cusp':
        with open('ghpages/templates/gallery_in_jupyter.md', 'r') as md:
            gallery_content = Markup(markdown.markdown(md.read()))
    return render_template('home.html', gallery_type=gallery_type, gallery_content=gallery_content)


@app.route('/download_cv.pdf')
def download_cv():
    try:
        return send_file('static/asset/cv.pdf',
                         attachment_filename='sunghoonyang_duke_resume.pdf')
    except Exception as e:
        return str(e)
