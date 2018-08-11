Web Portfolio
=================
#### Tools:
1. Flask
2. Jinja
3. gdrive (brew install gdrive)
3. Flask-Frozen (pip install flask_frozen)

#### Note:
* Taking my stake in github free-hosting bonnanza. 
* The Project Summary is imported from a Google Drive Document. 
* Manipulating iframe outside the document is impossible. Tried allowing CORS in the app without success.
    * Resolved by using gdrive bash cli, and downloading the Google Doc in HTML. This is parsed using BeautifulSoup4, and style, body content, scripts are written to respective files inside the ghpages flask App. Check ghpages/create_my_project_html.py