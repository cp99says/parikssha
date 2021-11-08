from transformer_src import *

ques_ans_gen = pipeline("question-generation", model="valhalla/t5-small-qg-prepend", qg_format="prepend")
ans = pipeline("multitask-qa-qg", model="valhalla/t5-base-qa-qg-hl", qg_format="prepend")