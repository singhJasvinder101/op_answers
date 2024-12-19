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

# def llama_response(question: str) -> str:
#     try:
#         llm = ChatGroq(
#             model="llama-3.1-70b-versatile",
#             temperature=0.95,
#             api_key=llama_key
#         )

#         prompt = f"""
#         Please analyze the question below and perform the following:
#         - Identify if calculations are involved; if so, solve accurately and verify results.
#         - Provide the answer in this format: Answer: [Correct Option] - [Option Name].
#         - Also, return the level of the question in this format: Level: [Level].
#         - For non-question input, respond appropriately.

#         Example:
#         Answer: A - Option Name

#         Question: {question}
#         """
#         response = llm.invoke(prompt)
#         return response.content.strip()
#     except Exception as e:
#         print(f"Error in llama_response: {e}")
#         return "Error processing your question."



# print(response.json())
import os

os.environ["GITHUB_TOKEN"] = "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"

print(os.environ.get("GITHUB_TOKEN"))

import os
from openai import OpenAI

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
