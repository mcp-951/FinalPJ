from flask import Flask, Response
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json
import time

app = Flask(__name__)
CORS(app)


def get_news_image(article_url):
    """
    각 뉴스 기사 페이지에 접근하여 주요 이미지를 추출하는 함수.
    :param article_url: 뉴스 기사 링크
    :return: 이미지 URL (없으면 빈 문자열 반환)
    """
    try:
        response = requests.get(article_url)
        response.encoding = 'utf-8'
        article_soup = BeautifulSoup(response.text, 'html.parser')

        # 뉴스 페이지의 주요 이미지 태그를 선택 (사이트별로 구조가 다를 수 있음)
        img_tag = article_soup.select_one('meta[property="og:image"]')  # og:image 태그 사용
        if img_tag and 'content' in img_tag.attrs:
            return img_tag['content']

        # 만약 og:image 태그가 없을 경우 일반 img 태그를 사용
        img_fallback = article_soup.find('img')
        if img_fallback and 'src' in img_fallback.attrs:
            return img_fallback['src']

    except Exception as e:
        print(f"Failed to fetch image from {article_url}: {e}")

    return ''  # 이미지가 없거나 오류가 발생할 경우 빈 문자열 반환


@app.route('/api/news/gallery', methods=['GET'])
def get_gallery_news():
    # 1. 뉴스 리스트 페이지 크롤링
    url = "https://news.daum.net/economic#1"  # 뉴스 리스트 페이지 URL
    response = requests.get(url)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')

    # .list_newsmajor 밑의 li 요소들 추출
    li_elements = soup.select('.list_newsmajor li')

    # 뉴스 기사 리스트
    gallery_list = []

    # 각 뉴스 항목에서 필요한 정보 추출
    for li in li_elements:
        a_tag = li.find('a', class_='link_txt')  # 각 뉴스의 제목이 포함된 a 태그
        text = a_tag.get_text().strip() if a_tag else ''  # 텍스트 추출
        link = a_tag['href'] if a_tag and 'href' in a_tag.attrs else ''  # 뉴스 기사 링크 추출

        # 2. 각 뉴스 페이지로 접근하여 고해상도 이미지 URL 가져오기
        image_url = get_news_image(link)

        # 뉴스 정보를 리스트에 추가
        if text and link:
            gallery_list.append({
                "text": text,  # 뉴스 제목
                "link": link,  # 뉴스 링크
                "image": image_url  # 뉴스 이미지 (상세 페이지에서 가져온 URL)
            })

        # 너무 빠르게 요청하지 않도록 잠시 대기 (2초)
        time.sleep(2)

    # 3. 크롤링한 데이터를 JSON 형태로 반환
    json_data = json.dumps(gallery_list, ensure_ascii=False)

    return Response(json_data, content_type='application/json; charset=utf-8')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
