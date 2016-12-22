# -*- coding: utf-8 -*-

'''Entry point to all things to avoid circular imports.'''
from ghpages.app import app, freezer
from ghpages.views import *

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)