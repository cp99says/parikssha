import io
import requests
import pytesseract
from PIL import Image

def convert_img2text(image_link: str):
    response = requests.get(image_link)
    # print( type(response) ) # <class 'requests.models.Response'>
    img = Image.open(io.BytesIO(response.content))
    # print( type(img) ) # <class 'PIL.JpegImagePlugin.JpegImageFile'>
    text = pytesseract.image_to_string(img)
    return normalize_text(text)

def normalize_text(text):
        puncts = ['/', ',', '.', '"', ':', ')', '(', '-', '!', '?', '|', ';', '$', '&', '/', '[', ']', '>', '%', '=', '#', '*', '+', '\\', '•',  '~', '@', '£', 
         '·', '_', '{', '}', '©', '^', '®', '`',  '<', '→', '°', '€', '™', '›',  '♥', '←', '×', '§', '″', '′', 'Â', '█', '½', 'à', '…', 
         '“', '★', '”', '–', '●', 'â', '►', '−', '¢', '²', '¬', '░', '¶', '↑', '±', '¿', '▾', '═', '¦', '║', '―', '¥', '▓', '—', '‹', '─', 
         '▒', '：', '¼', '⊕', '▼', '▪', '†', '■', '’', '▀', '¨', '▄', '♫', '☆', 'é', '¯', '♦', '¤', '▲', 'è', '¸', '¾', 'Ã', '⋅', '‘', '∞', 
         '∙', '）', '↓', '、', '│', '（', '»', '，', '♪', '╩', '╚', '³', '・', '╦', '╣', '╔', '╗', '▬', '❤', 'ï', 'Ø', '¹', '≤', '‡', '√', ]

        def clean_text(text):
            text = str(text)
            text = text.replace('\n', ' ')
            text = text.replace('\r', ' ')
            for punct in puncts:
                if punct in text:
                    text = text.replace(punct, ' ')
            return text.lower()

        text = clean_text(text)

        return text