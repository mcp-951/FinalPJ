import pytesseract
import re
import cv2
import os
import sys
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

sys.stdout.reconfigure(encoding='utf-8')
#이미지 전처리 시작하기
script_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(script_dir, 'ocr.png')
img_ori=cv2.imread(image_path)
height, width, channel = img_ori.shape
gray = cv2.cvtColor(img_ori, cv2.COLOR_BGR2GRAY)

img_blurred = cv2.GaussianBlur(gray, ksize=(5, 5), sigmaX=0)

text = pytesseract.image_to_string(img_blurred, lang="kor")
text = text.replace(" ", "")
text = text.replace("\n", "")
text_cleaned = re.sub(r"[^\uAC00-\uD7A3a-zA-Z0-9-]", "", text)
#print(text_cleaned)

data = text_cleaned.split("-")

first = data[0]
last = data[-1]

firstNo = first[-6:]
lastNo = last[0:7]
print(firstNo)
print(lastNo)