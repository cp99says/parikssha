# from utils.transformer_src import *
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List
from pydantic import BaseModel
import pke
from bson import ObjectId
from nltk.tokenize import sent_tokenize
from flashtext import KeywordProcessor
import motor.motor_asyncio
from dotenv import load_dotenv
from utils.img2text import convert_img2text
# from utils.load_models import *
import uuid 
import random
import datetime 
import os

load_dotenv()



client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get('MONGO_URL'))
database = client['Hacksummit_DB']
exam = database.get_collection("Exams")
response = database.get_collection("Responses")


class Upload_Object(BaseModel):
    blob_url: str
    blob_type : str

class AnswerGen(Upload_Object):
    question: str
# qa_model = pipeline("question-generation", model="valhalla/t5-small-qg-prepend", qg_format="prepend")
# ans = pipeline("multitask-qa-qg", qg_format="prepend")

class StudentResponse(BaseModel):
    QuestionID : str
    response : str
class ResponseSchema(BaseModel):
    student_username: str
    answers: List[StudentResponse]
    

app = APIRouter()

@app.post('/keytopics', status_code = 200)
async def getkeytopics(img_details: Upload_Object):
    img_text = convert_img2text(img_details.blob_url)    
    extractor = pke.unsupervised.TopicRank()
    extractor.load_document(input=img_text, language='en_core_web_sm')
    extractor.candidate_selection()
    extractor.candidate_weighting()
    keyphrases = extractor.get_n_best(n=5)
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
        res = {}
        for k,v in keyword_sentences.items():
            if v:
                res[k] = v
        return res

    sentences = tokenize_sentences(img_text)
    keyword_sentence_mapping = get_sentences_for_keyword(keyphrases, sentences)
    return keyword_sentence_mapping


@app.get('/examination/{code}')
async def get_questions(code: str):
    exam_details = await exam.find_one({'exam_code': code},{'_id': 0})
    return exam_details

@app.post('/getanswers')
async def get_answers(answer_gen: AnswerGen):
    context = convert_img2text(answer_gen.blob_url)
    answer = ans({
    "question": answer_gen.question,
    "context": context
    })
    
    return {"status":200, "question": answer_gen.question, "answer": answer}


@app.put('/response/{code}')
async def update_responses(code: str, res_schema: ResponseSchema):
    response_details = await response.find_one({'exam_code': code},{'_id': 0})
    if response_details:        
        response_details["response"].append(jsonable_encoder(res_schema))
        print(response_details)
        updated_response = await response.update_one({'exam_code': code}, {"$set": response_details})
        if updated_response:
            return {'status': 200, "message": "Your response has been updated"}
        
    return {'status': 404, "message": "Response details not found"}


@app.get('/answerkey/{code}')
async def get_answer_key(code: str):
    exam_details = await exam.find_one({'exam_code': code},{'_id': 0})
    if exam_details:
        return {"status": 200, "questions": exam_details['questions']}
    
    return {"status": 404, "message": "No results found"}

@app.get('/question/answerkey/{code}/{question_id}')
async def get_question_answer(code: str, question_id: str):
    exam_details = await exam.find_one({'exam_code': code},{'_id': 0})
    for ques_details in exam_details['questions']:
        if ques_details['answer_key_id'] == str(question_id + code):
            return {'status': 200, 'answer': ques_details['answer']}
        
    return {"status": 404, "message": "No results found"}