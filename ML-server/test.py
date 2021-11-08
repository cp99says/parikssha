import pke
from nltk.tokenize import sent_tokenize
from flashtext import KeywordProcessor

def keyword(img_text):          
    extractor = pke.unsupervised.TopicRank()
    extractor.load_document(input=img_text, language='en_core_web_sm')
    extractor.candidate_selection()
    extractor.candidate_weighting()
    keyphrases = extractor.get_n_best(n=10)
    keyphrases = [keyphrase[0] for keyphrase in keyphrases]
    

    def tokenize_sentences(text): 
        sentences = [sent_tokenize(text)]
        sentences = [y for x in sentences for y in x]
        sentences = [sentence.strip() for sentence in sentences if len(sentence) > 20]
        return sentences

    def get_sentences_for_keyword(keywords, sentences):
        keyword_processor = KeywordProcessor()
        keyword_sentences = {}
        for word in keywords:
            keyword_sentences[word] = []
            keyword_processor.add_keyword(word)
        added_sen = []
        for sentence in sentences:
            keywords_found = keyword_processor.extract_keywords(sentence)
            for key in keywords_found:
                if sentence not in added_sen:
                    keyword_sentences[key].append(sentence)
                    added_sen.append(sentence)

        for key in keyword_sentences.keys():
            values = keyword_sentences[key]
            values = sorted(values, key=len, reverse=True)
            keyword_sentences[key] = values
        return keyword_sentences

    sentences = tokenize_sentences(img_text)
    # print(sentences)
    keyword_sentence_mapping = get_sentences_for_keyword(keyphrases, sentences)
    res = {}
    for k,v in keyword_sentence_mapping.items():
        if v:
            res[k] = v
    return res

text = '''Gravity (from Latin gravitas, meaning 'weight'), or gravitation, is a natural phenomenon by which all things with mass or energy—including planets, stars, galaxies, and even light—are brought toward (or gravitate toward) one another. On Earth, gravity gives weight to physical objects, and the Moon's gravity causes the ocean tides. The gravitational attraction of the original gaseous matter present in the Universe caused it to begin coalescing and forming stars and caused the stars to group together into galaxies, so gravity is responsible for many of the large-scale structures in the Universe. Gravity has an infinite range, although its effects become increasingly weaker as objects get further away
'''

print(keyword(text))