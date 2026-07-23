import re

file_path = "src/components/AgenticApplicationOverview.tsx"
with open(file_path, 'r') as f:
    content = f.read()

# Fix self-closing tags
content = content.replace('<br>', '<br />')

# Fix HTML comments to JSX comments
content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content)

with open(file_path, 'w') as f:
    f.write(content)

print("done")
