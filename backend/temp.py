# import requests
# import json
# import os

# OPENROUTER_API_KEY = "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"

# response = requests.post(
#   url="https://openrouter.ai/api/v1/chat/completions",
#   headers={
#     "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#   },
#   data=json.dumps({
#     "model": "openai/chatgpt-4o-latest", # Optional
#     "messages": [
#       {
#         "role": "user",
#         "content": [
#           {
#             "type": "text",
#             "text": "What's in this image?"
#           },
#           {
#             "type": "image_url",
#             "image_url": {
#               "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
#             }
#           }
#         ]
#       }
#     ]
    
#   })
# )


# print(response.json())
import os

# Set the environment variable
os.environ["GITHUB_TOKEN"] = "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"

# Verify that the variable is set (optional)
print(os.environ.get("GITHUB_TOKEN"))

"""Run this model in Python

> pip install openai
"""
import os
from openai import OpenAI

# To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
# Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.environ["GITHUB_TOKEN"],
)

response = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "",
        },
        {
            "role": "user",
            "content": """
Telnet is a ______ based computer protocol ?
Sound

Text

Image

Animation
""",
        }
    ],
    model="gpt-4o",
    temperature=1,
    max_tokens=4096,
    top_p=1
)

print(response.choices[0].message.content)
