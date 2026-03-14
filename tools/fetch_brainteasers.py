import urllib.request
import json
import os

url = "https://raw.githubusercontent.com/openai/grade-school-math/master/grade_school_math/data/test.jsonl"
print("Fetching 1300+ math/logic brainteasers from GSM8K...")
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    lines = response.read().decode('utf-8').strip().split('\n')

brainteasers = []
for i, line in enumerate(lines):
    if i >= 1050: # We just need 1000+
        break
    data = json.loads(line)
    
    # GSM8K has high-quality math word problems
    # The answer usually has the logic followed by #### <number>
    answer_text = data["answer"].replace("####", "\n\n**Final Answer:**")
    
    difficulty = "Hard" if len(answer_text) > 400 else "Medium" if len(answer_text) > 200 else "Easy"
    
    bt = {
        "id": f"gsm8k-{i}",
        "category": "Math & Logic",
        "difficulty": difficulty,
        "mechanics": ["Mental Math", "Word Problem", "Equations"],
        "question": {
            "en": data["question"],
            "fr": "[English Only Dataset] " + data["question"] # Translated on the fly or just kept in English
        },
        "solution": {
            "en": answer_text,
            "fr": "[English Only Dataset] " + answer_text
        }
    }
    brainteasers.append(bt)

target_file = 'src/data/brainteasers.json'
existing_data = []
if os.path.exists(target_file):
    with open(target_file, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)

# Combine original handcrafted ones with the newly scraped ones
combined = existing_data + brainteasers

with open(target_file, 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=2)

print(f"Successfully saved {len(combined)} brainteasers to {target_file}")
