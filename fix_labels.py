file_path = "src/components/DigitalTwinDecisionPanel.tsx"
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('text-muted-foreground', 'text-white')

with open(file_path, 'w') as f:
    f.write(content)

print("done")
