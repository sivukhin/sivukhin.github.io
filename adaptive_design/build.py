#!/usr/bin/python3

import html
from bs4 import BeautifulSoup, Comment, NavigableString
import glob
import time
import sys
import subprocess
import watchdog
import os

from watchdog.observers import Observer  
from watchdog.events import PatternMatchingEventHandler  

def rebuild():
    with open('template.html') as f:
        template = f.read()
    for name in glob.glob('*.htm'):
        print(name)
        template_soup = BeautifulSoup(template, 'html.parser')
        file_to = os.path.splitext(name)[0] + '.html'
        with open(name) as f:
            content = f.read()
        content_soup = BeautifulSoup(content, 'html.parser')
        first_item = None
        changed = []
        for comment in reversed(content_soup.findAll(text=lambda text: isinstance(text, Comment))):
            value = ''
            start = False
            new_first_item = None
            for inner in comment.findNextSiblings():
                new_first_item = inner if not new_first_item else new_first_item
                if inner == first_item:
                    break
                value += str(inner).strip()
            first_item = new_first_item
            tokens = comment.string.strip().split()
            find_tag = tokens[0]
            find_attributes = {}
            for token in tokens[1:]:
                parts = token.split(':')
                if len(parts) == 2:
                    find_attributes[parts[0]] = parts[1]
            for insert_to in template_soup.findAll(find_tag, find_attributes):
                changed.append((insert_to, BeautifulSoup(value, 'html.parser')))
        for change in reversed(changed):
            change[0].append(change[1])

        with open(file_to, 'w') as f:
            f.write(template_soup.prettify())

class ChangesHandler(PatternMatchingEventHandler):
    patterns = ["*.html", "*.htm"]

    def process(self, event):
        filename = os.path.basename(event.src_path)
        if filename == 'template.html' or os.path.splitext(filename)[1] == '.htm':
            try:
                rebuild()
            except Exception:
                pass

    def on_modified(self, event):
        self.process(event)

    def on_created(self, event):
        self.process(event)

if __name__ == '__main__':
    args = sys.argv[1:]
    observer = Observer()
    observer.schedule(ChangesHandler(), path=args[0] if args else '.')
    observer.start()

    rebuild()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
