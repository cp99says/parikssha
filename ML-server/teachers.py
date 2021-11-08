from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from typing import *
import motor.motor_asyncio
from dotenv import load_dotenv
from utils.img2text import convert_img2text
from utils.similarity import *
from bson import ObjectId
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
marks = database.get_collection("Marks")
# qa_model = pipeline("question-generation", qg_format="prepend")
# ans = pipeline("multitask-qa-qg", model="valhalla/t5-base-qa-qg-hl", qg_format="prepend")
class Similarity(BaseModel):
    original: str
    response: str
    
class Upload_Object(BaseModel):
    blob_url: str
    question_count : int
    subject: str  # phy and chem
    topic_name: str
    
class ExamSchema(BaseModel):
    _id : ObjectId
    exam_started : bool
    teacher_id : str
    total_questions : int
    exam_type : str
    questions : list

# class MarksSchema(BaseModel):
        

app = APIRouter()

@app.post('/similarity', status_code = 200)
async def check_similarity(sim: Similarity):
    '''
    Check the similarity of two strings. We use this to get the simialrity score ot of 10
    '''
    original = sim.original
    response = sim.response
    score = fuzz.token_sort_ratio(original, response)/10
    return {'status': 200, 'score': score}

'''
final_dict = {'exam_code': '3e32f',
 'exam_started': False,
 'teacher_id': 'abcd',
 'total_questions': 2,
 'exam_type': 'subjective',
 'questions': [{'answer': 'Python',
   'question': 'What is a high-level, general-purpose programming language?',
   'question_id': '40818',
   'answer_key_id': '408183e32f'},
  {'answer': 'Guido van Rossum',
   'question': 'Who created Python?',
   'question_id': '84911',
   'answer_key_id': '849113e32f'}]}
response_dict = {'exam_code': '37143',
  'teacher_id': 'abcd',
  'exam_date': '2021-10-04',
  'response': []}
'''

@app.post('/initexam/{teacher_id}', status_code=201)
async def start_exam(teacher_id: str, img_details: Upload_Object):
    '''
    Used by the teachers to start an exam. Post the link to the s3 object(image) and Qs will
    be generated and stored in the db. Returns the exam code. We use this exam code to check the Qs generated
    '''
    try:
        img_text = convert_img2text(img_details.blob_url)
        if not img_text: 
            return {'status': 404, "message": "Text details could not be extracted"}
        question_count = img_details.question_count 
        qa = ques_ans_gen(img_text)
        if question_count < len(qa):
            qa = random.sample(qa, question_count)
        final_dict = {}
        response_dict = {}
        date_object = datetime.date.today()
        final_dict["exam_code"] = str(uuid.uuid1())[:5]
        for text in qa:
            text['question_id'] = str(random.randint(10000,99999))
            text['answer_key_id'] = text['question_id'] + final_dict['exam_code']
            text['answer'] = text['answer'][6:]
            
        final_dict["exam_started"] = False
        final_dict['subject'] = img_details.subject.lower()
        final_dict['topic_name'] = img_details.topic_name
        final_dict["teacher_id"] = teacher_id
        final_dict["total_questions"] = len(qa)
        final_dict["exam_type"] = "subjective"

        response_dict = {}
        response_dict['exam_code'] = final_dict["exam_code"]
        response_dict['teacher_id'] = final_dict["teacher_id"]
        response_dict['exam_date'] = str(date_object)
        response_dict['response'] = []

        marks_dict = {'teacher_id': final_dict["teacher_id"],
        'exam_code': final_dict["exam_code"],
        'student_grades': []
        }

        for text in qa:
            text["question_id"] = str(random.randint(10000,99999))
            text["answer_key_id"] = text["question_id"] + final_dict["exam_code"]
            text["answer"] = text["answer"]
        
        final_dict["questions"] = qa
        exam_insert = await exam.insert_one(final_dict)
        response_insert = await response.insert_one(response_dict)
        marks_insert = await marks.insert_one(marks_dict)
        
        return {"status": 201, 'exam_code': final_dict['exam_code']}
    except Exception as e:
        return {'status': 404, "message": "Text details could not be extracted"}

@app.patch('/exam/{code}')
async def update_exam(code: str, examschema: ExamSchema):
    exam_details = await exam.find_one({'exam_code': code},{'_id': 0})
    if exam_details:
        updated_exam = await exam.update_one({'exam_code': code}, {"$set": dict(examschema)})
        if updated_exam:
            return {'status': 200, "message": "Exam details updated"}
    
    return {'status': 404, "message": "Exam details not found"}


@app.get('/exam/history/{teacher_id}')
async def get_exam_history(teacher_id: str):
    exam_list = []
    past_exams = exam.find({'teacher_id': teacher_id},{'_id': 0})
    async for past_exam in past_exams:
        exam_list.append(past_exam)
        
    if len(exam_list) == 0:
        return {'status': 404, "message": "Exam details not found"}
    
    return {'status': 200, 'history': exam_list}
    

@app.get('/exam/response/{code}')
async def get_exam_responses(code: str):
    response_detail = await response.find_one({'exam_code': code},{'_id': 0})
    if response_detail:
        return response_detail
    
    return {'status': 200, 'message': 'Exam Response Details not found'}
    

@app.put('/exam/scores/{code}')
async def eval_answer_scores(code: str):
    exam_details = await exam.find_one({'exam_code': code},{'_id': 0})
    response_details = await response.find_one({'exam_code': code},{'_id': 0})
    marks_details = await marks.find_one({'exam_code': code},{'_id': 0})
    if exam_details and marks_details:
        marks_dict = {}
        marks_dict['teacher_id'] = response_details['teacher_id']
        marks_dict['exam_code'] = response_details['exam_code']
        marks_list = []
        student_marks = {}
        ks = response_details['response']
        es= exam_details['questions']
        for k in ks:
            sum_score = 0
            student_marks = {}    
            print(k['student_username'])
            student_marks['student_username'] = k['student_username']
            for ans_obj in k['answers']:
                resp_score = match_answer(es, ans_obj['response'], ans_obj['QuestionID'])
                print(resp_score)
                sum_score += resp_score
            print("Sum score: ", sum_score)
            sum_score = sum_score/exam_details['total_questions'] 
            student_marks['score'] = sum_score
            marks_list.append(student_marks)
        marks_dict['student_grades'] = marks_list
        marks_update = await marks.update_one({'exam_code': code}, {"$set": marks_dict})
        return {'status': 200, "message": "Exam grade details updated"}
    
    return {'status': 404, "message": "Exam details not found"}

@app.get('/exam/scoresall/{teacher_id}')
async def get_exam_scores_teacher(teacher_id: str):
    marks_list = []
    past_exams = marks.find({'teacher_id': teacher_id},{'_id': 0})
    async for past_exam in past_exams:
        marks_list.append(past_exam)
        
    if len(marks_list) == 0:
        return {'status': 404, "message": "Exam details not found"}
    
    return {'status': 200, 'history': marks_list}


@app.get('/exam/score/{code}')
async def get_exam_score(code: str):
    marks_details = await marks.find_one({'exam_code': code},{'_id': 0})
    if marks_details:
        return marks_details
  
    return {'status': 404, "message": "Exam details not found"}


@app.get('/exam/subjectwise/{subject}/{teacher_id}')
async def get_exam_subject_wise(subject: str, teacher_id: str):
    exam_list = []
    exam_details = exam.find({'subject': subject.lower(), 'teacher_id': teacher_id},{'_id': 0})
    async for exam_detail in exam_details:
        exam_list.append(exam_detail)        
    if not exam_list:
        return {'status': 404, "message": "Exam details not found"}
    
    return {'status': 200, 'history': exam_list}


@app.get('/exam/average/{code}')
async def get_exam_average_score(code: str):
    exam_grade = await marks.find_one({'exam_code': code},{'_id': 0})
    if exam_grade:
        avg_score = 0
        for student in exam_grade['student_grades']:
            avg_score += student['score']

        avg_score = avg_score/len(exam_grade['student_grades'])
        return {'status': 200, "average": round(avg_score, 2)}
    
    return {'status': 404, "message": "Exam details not found"}