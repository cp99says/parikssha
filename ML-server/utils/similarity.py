from fuzzywuzzy import fuzz
from fuzzywuzzy import process

def similarity(original, response):
    set_ratio = fuzz.token_set_ratio(original.lower(), response.lower())
    partial_ratio = fuzz.partial_ratio(original.lower(), response.lower())

    return (set_ratio + partial_ratio)/20

def match_answer(es, response, qid):    
    for e in es:
        if e['question_id'] == qid:
            return similarity(e['answer'], response)
    return 0