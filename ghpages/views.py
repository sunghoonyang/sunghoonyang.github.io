from flask import render_template, redirect, url_for, send_file, request
from ghpages.app import app
# for gallery-in-jupyter github markdown import
import markdown
from flask import Markup


@app.route('/')
def home():
    gallery_type, gallery_content = '', ''
    return render_template('home.html', **locals())


@app.route('/gallery/coupang/')
def coupang_gallery():
    return render_template('home.html', gallery_type='coupang', gallery_content='')


@app.route('/gallery/cusp/')
def cusp_gallery():
    with open('ghpages/templates/gallery_in_jupyter.md', 'r') as md:
        gallery_content = Markup(markdown.markdown(md.read()))
        return render_template('home.html', gallery_type='cusp', gallery_content=gallery_content)


@app.route('/download_cv.pdf')
def download_cv():
    try:
        return send_file('static/asset/cv.pdf',
                         attachment_filename='sunghoonyang_duke_resume.pdf')
    except Exception as e:
        return str(e)
