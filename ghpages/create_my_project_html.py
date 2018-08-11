from subprocess import Popen, PIPE
from bs4 import BeautifulSoup
import os
import cssutils
import re

__doc__ = """Parse HTML.
What it does:
    1. get body content
    2. get style
"""

if __name__ == '__main__':
    """get file using gdrive bash cli utility"""
    cmd = 'gdrive export --mime -f text/html %s' % os.environ['GOOGLE_DRIVE_FILE_ID']
    IMPORT_PATH = os.environ['IMPORT_PATH']
    OUTPUT_HTML_PATH = os.environ['OUTPUT_HTML_PATH']
    OUTPUT_CSS_PATH = os.environ['OUTPUT_CSS_PATH']
    OUTPUT_JS_PATH = os.environ['OUTPUT_JS_PATH']
    p = Popen(cmd, shell=True, stdout=PIPE)
    _ = p.communicate()[0]

    """extract style, body, script"""
    with open(IMPORT_PATH, 'r') as html_doc, open(OUTPUT_HTML_PATH, 'w') as output_html\
            , open(OUTPUT_CSS_PATH, 'w') as output_css, open(OUTPUT_JS_PATH, 'w') as output_js:
        soup = BeautifulSoup(html_doc, 'html.parser')
        for part, content in dict(style=soup.head.style.text, body=soup.body, script=soup.script).items():
            if content:
                if part == 'style':
                    output_css.write(content.strip())
                elif part == 'script':
                    output_js.write(content.prettify())
                elif part == 'body':
                    content['class'] = content.get('class', []) + ['container']
                    content.name = 'div'
                    css = content.get('style', [])
                    s = cssutils.parseStyle(css)
                    s.padding = r'12pt 12pt 12pt 12pt'
                    content['style'] = re.sub('\n', '', s.cssText)
                    output_html.write(content.prettify())

