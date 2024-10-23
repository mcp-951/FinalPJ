import os
import openai

openai.api_key = "sk-o0C5sg489GZZsAontonFfw1vOMITyp0sdEylQVnMZ_T3BlbkFJ-d4pAYbQoKnQcdXpTVtsCKf0jXd0E-rS5PC2YDYS4A"

# openai.File.create(file=open("./TrainData.jsonl","rb"),purpose="fine-tune")

# openai.File.list()
# print(openai.File.list())
openai.FineTuningJob.create(training_file='file-VcCmGEA54vBEEAONNab9NkWb', model = 'gpt-3.5-turbo')
