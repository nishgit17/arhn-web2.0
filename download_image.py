import requests
import io
from PIL import Image

file_id = "1H93tC6VRHVCWy9M2j5_bPXhrZlgddEvr"
url = f"https://drive.google.com/uc?id={file_id}&export=download"

print(f"Downloading from {url}...")
session = requests.Session()
response = session.get(url, stream=True)

for key, value in response.cookies.items():
    if key.startswith('download_warning'):
        response = session.get(url, params={'confirm': value}, stream=True)
        break

if response.status_code == 200:
    try:
        img = Image.open(io.BytesIO(response.content))
        img.save("assets/images/aarohan-cards/optimized/corner-techmela.webp", "WEBP")
        print("Successfully saved corner-techmela.webp")
    except Exception as e:
        print("Error processing image:", e)
else:
    print(f"Failed to download. Status code: {response.status_code}")
