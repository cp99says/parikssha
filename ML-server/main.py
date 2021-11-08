from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from utils.transformer_src import *
import students, teachers
import nltk
import spacy
import os

main = FastAPI(title="Hacksummit | ZeroDSA",
                description="API endpoints for Pariksha",
                version="1.0")

origins = ['*']
main.add_middleware(CORSMiddleware, 
                allow_origins=origins, 
                allow_credentials=True, 
                allow_methods=["*"],
                allow_headers=["*"]
                )

# @app.on_event("startup")
# async def startup_init():

# nltk.download('stopwords')

main.include_router(students.app, prefix = "/api/students", tags=["Routes for Student Ops"])
main.include_router(teachers.app,  prefix = "/api/teacher", tags=["Routes for Teacher Ops"])

@main.get('/', include_in_schema=False)
async def home(request: Request):
    return {"message": "Server up and running", "status": 200}