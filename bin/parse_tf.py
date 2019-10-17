import fileinput
import re
import json
import sys

tags = []
for line in fileinput.input():
    line = re.sub(r'\(.*\)', '', line)
    tags = tags + line.split(',')
    tags = list(map(lambda s: s.strip(), tags))

print(json.dumps(tags).replace('"','\\"')
