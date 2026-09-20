import re

html_path = '/home/ritesh/Projects/Active/Vibe Game/tests/runner.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all addTest calls
# Example: addTest('Tier 1: Feature Coverage', 'F1: Fullscreen Canvas Rendering', 'F1-1: CanvasEngine is instantiable with a canvas', () => {
add_test_pattern = re.compile(r"addTest\s*\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*,", re.DOTALL)
matches = add_test_pattern.findall(content)

print(f"Total addTest matches found: {len(matches)}")

# Verify uniqueness of test names
test_names = set()
duplicates = []
for m in matches:
    tier, feature, name = m
    full_name = f"{tier} || {feature} || {name}"
    if full_name in test_names:
        duplicates.append(full_name)
    else:
        test_names.add(full_name)

print(f"Unique test cases: {len(test_names)}")
if duplicates:
    print("Found duplicate test definitions:")
    for d in duplicates:
        print(f"  - {d}")
else:
    print("No duplicate test cases found.")

# Verify each test case has a function block and assertions
# We will do a rough check on the structure of the HTML
# Check for any hardcoded bypasses in runner.html, e.g. overriding window.testResults with hardcoded values without executing fn.
bypass_keywords = [
    "window.testResults = { passed: 82",
    "passedCount = 82",
    "failedCount = 0",
]

for kw in bypass_keywords:
    if kw in content:
        # Check if it is hardcoded without calculation
        print(f"WARNING: Potential bypass keyword found: '{kw}'")
