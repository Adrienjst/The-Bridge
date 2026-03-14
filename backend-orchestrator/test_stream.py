import requests

url = "http://localhost:8000/stream"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer dev_secret_key_123"
}
data = {
    "user_id": "test-user-123",
    "weak_modules": ["Options Grecques", "Volatilité"],
    "messages": [
        {"role": "user", "content": "Peux-tu m'expliquer le Delta et le Gamma de manière très simple ?"}
    ]
}

print("Sending request to FastAPI...")
response = requests.post(url, headers=headers, json=data, stream=True)

if response.status_code == 200:
    print("Stream connected. Receiving chunks:\n")
    for line in response.iter_lines():
        if line:
            decoded_line = line.decode('utf-8')
            if decoded_line.startswith("data: "):
                chunk = decoded_line[6:] # Strip "data: "
                if chunk == "[DONE]":
                    print("\n\n[Stream Finished]")
                    break
                # Replace our custom newline escapes with actual newlines
                print(chunk.replace("\\n", "\n"), end="", flush=True)
else:
    print(f"Error: {response.status_code}")
    print(response.text)
