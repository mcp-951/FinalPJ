import pytesseract
import re
import cv2
import os
import sys

# Tesseract 경로 설정
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

sys.stdout.reconfigure(encoding='utf-8')

# 이미지 전처리 시작
script_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(script_dir, 'ocr.png')
img_ori = cv2.imread(image_path)

# 이미지 크기 가져오기
height, width, _ = img_ori.shape

# ROI 비율 설정
first_x_ratio = 0.1
first_y_ratio = 0.24
first_roi_width_ratio = 0.21
first_roi_height_ratio = 0.14
second_x_ratio = 0.095
second_y_ratio = 0.395
second_roi_width_ratio = 0.41
second_roi_height_ratio = 0.1

# 첫 번째 ROI 좌표 계산
first_roi_x = int(width * first_x_ratio)
first_roi_y = int(height * first_y_ratio)
first_roi_width = int(width * first_roi_width_ratio)
first_roi_height = int(height * first_roi_height_ratio)

# 두 번째 ROI 좌표 계산
second_roi_x = int(width * second_x_ratio)
second_roi_y = int(height * second_y_ratio)
second_roi_width = int(width * second_roi_width_ratio)
second_roi_height = int(height * second_roi_height_ratio)

# 첫 번째 ROI 잘라내기
img_first_roi = img_ori[first_roi_y:first_roi_y + first_roi_height, first_roi_x:first_roi_x + first_roi_width]
# 두 번째 ROI 잘라내기
img_second_roi = img_ori[second_roi_y:second_roi_y + second_roi_height, second_roi_x:second_roi_x + second_roi_width]

# ROI 표시를 위한 사각형 그리기
cv2.rectangle(img_ori, (first_roi_x, first_roi_y), (first_roi_x + first_roi_width, first_roi_y + first_roi_height), (0, 255, 0), 2)
cv2.rectangle(img_ori, (second_roi_x, second_roi_y), (second_roi_x + second_roi_width, second_roi_y + second_roi_height), (0, 0, 255), 2)

# 이미지 전처리 (배경을 검은색으로 만들고 글자는 하얀색으로 만들기)
def preprocess_image(image):
    # 그레이스케일로 변환
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 이진화 (Otsu의 이진화)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # 이미지 선명하게 만들기 (Optional)
    laplacian = cv2.Laplacian(binary, cv2.CV_64F)
    laplacian = cv2.convertScaleAbs(laplacian)
    sharpened = cv2.addWeighted(binary, 1.5, laplacian, -0.5, 0)

    return sharpened

# ROI 이미지 전처리
img_first_processed = preprocess_image(img_first_roi)
img_second_processed = preprocess_image(img_second_roi)

# 첫 번째 OCR 수행
text_first = pytesseract.image_to_string(img_first_processed, lang="kor")
text_first = text_first.replace(" ", "").replace("\n", "")
# 한국어 문자만 남기기
text_first_cleaned = re.sub(r"[^가-힣]", "", text_first)

# 두 번째 OCR 수행 (숫자만 인식)
text_second = pytesseract.image_to_string(img_second_processed, lang="kor")
text_second = text_second.replace(" ", "").replace("\n", "")
# 숫자만 남기기
text_second_cleaned = re.sub(r"[^\d]", "", text_second)

# 데이터 처리
name = text_first_cleaned
number = text_second_cleaned
if len(number) > 14:
    local_number = number[-13:]
else :
    local_number = number
print(name)
print(local_number)

# 결과 이미지와 ROI 이미지 표시
cv2.imshow("Original Image with ROIs", img_ori)
cv2.imshow("Processed First ROI", img_first_processed)
cv2.imshow("Processed Second ROI", img_second_processed)

# 키 입력 대기 후 모든 창 닫기
cv2.waitKey(0)
cv2.destroyAllWindows()