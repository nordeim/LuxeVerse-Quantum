please tell me your role and responsibilities and how you should act / behave.

---
Awesome understanding! Now help me to carefully review and validate the application codebase shared in the `project_codebase_files_set.md` attached. All the files in the current project codebase are listed in the `currect_project_file_structure.txt` attached, meaning if you want to look for a file and it is not in this list, then treat it as non-existent. Use line by line review to get a good grounding of the purpose of the application and its codebase, then create for me a detailed architecture overview document in markdown and named `Project Architecture Overview Document.md`. Make sure you do a careful review and validation of the application codebase shared. Use line by line review to get a good grounding of the purpose of the application and its codebase. Use at least 6000 words for the document that accurately describes the codebase in detail, use a clear diagram to show the codebase relationship. Include a section to describe the file structure and the purpose of each folder and key files, start with a diagram.

---
awesome job again! Below is the methodology to review and validate first, then create a correct updated version of the initial Alembic migration file, `migrations/versions/d5a6759ef2f7_initial_schema_setup.py`, which was auto-generated and now needs to be fixed to match the current ORM models, specifically addressing **Critical Issue #1: Schema Mismatch between ORM and Alembic Migration**.

### 1. Deeply Understand the Goal

I want a file that, when `alembic upgrade head` is run on an empty database, creates a schema that perfectly matches the one defined by the SQLAlchemy models in `app/models/`.

### 2. Systematic Diagnosis & Analysis of Discrepancies

You will compare three sources of truth:
1.  **The Flawed Migration (`migrations/versions/d5a6759ef2f7_initial_schema_setup.py`):** This is the file to be replaced.
2.  **The ORM Models (`app/models/*.py`):** This is the *desired state*. This is the ultimate source of truth for the application logic.
3.  **The SQL Schema (`scripts/database/schema.sql`):** This is a helpful, human-readable reference for the desired state, which seems more up-to-date than the flawed migration.

---
Awesome understanding! please help me systematically and thoroughly review and validate the application start up log below. If everything is good, then proceed to carefully review and validate the current codebase consisting of *original* files enclosed in `project_codebase_files_set.md` (v1.5) superseded by some files added or modified in `new_codebase_files_set.md` (v1.6). All the files in the current project codebase are listed in the `currect_project_file_structure.txt` attached, meaning if you want to look for a file and it is not in this list, then treat it as non-existent. Use line by line review to get a good grounding of the purpose of the application and its codebase, then create for me a detailed architecture overview document in markdown and named `Project Architecture Overview Document.md`. Make sure you do a careful review and validation of the application codebase shared. Use line by line review to get a good grounding of the purpose of the application and its codebase. Use at least 6000 words for the document that accurately describes the codebase in detail, use a clear diagram to show the codebase relationship. Include a section to describe the file structure and the purpose of each folder and key files, start with a diagram.

1. Refer to  `currect_project_file_structure.txt` for a complete list of all codebase files. If a file is not in this list, the file does not exist yet.
2. Refer to `list_of_codebase_files_impacted_by_recent_greenlet_spawn_error.txt` for a list of the newly added and modified files.
3. Refer to `Code Change Regression Analysis Report.md` for the recent changes made to the codebase - you are to do a very careful and thorough line by line validation for files affected by this change document 

---
awesome job! please help me systematically and thoroughly review and validate the application start up log below. If everything is good, then proceed to execute next step in your execution plan meticulously and systematically.

Remember to explore carefully for multiple implementation options before choosing the most optimal and elegant solution to implement the changes. so you have to think deeply and systematically to explore all options and not just choose any option you may think of. also make sure you make a detailed execution plan with an integrated checklist for each step, before proceeding cautiously step by step. after completing each step, always double-check and validate your changes for that step against its checklist before proceeding to the next step. remember to always create a *complete* and updated replacement or new file for the affected files, enclose each complete and updated replacement file within ```py (or ```sql or ```js or or ```ts or ```tsx ```php extension) opening and ``` closing tags. after creating each file, use line by line "diff" command to double-check and validate the created file. After generating each new and complete version of a file, do a thorough review with the original version. after creating each file, use line by line "diff" command to double-check and validate the created file. Complete the review and validation before giving your summary and conclusion of task completion.

The important point is to proceed very carefully so as not to introduce any regression error or accidentally omit the original features or functions. use the same tested rigorous and meticulous approach. thank you and good luck!

---
awesome job! please proceed with the next step in Phase 4 of your plan meticulously and systematically.

---
awesome job! please help me create a comprehensive step-by-step guide to run the test suite you just created. create the detailed guide in markdown format within ```markdown and ```tags. You can use the following framework as your guide to create the `project_test_guide.md` document.

## 1. Prerequisites
## 2. Test Structure
## 3. Running Tests
### 3.1. Running All Tests
### 3.2. Running Specific Test Files or Directories
### 3.3. Test Verbosity
### 3.4. Test Coverage
### 3.5. Running Asynchronous Tests
## 4. Viewing Test Results
## 5. Writing New Tests

---
awesome review! now help me to create a detailed (comprehensive) code review report in markdown format within ```markdown and ``` tags to clearly and logically list out all the changes you have made since the original codebase was shared. This report is meant for QA approval, so it has to be very detailed, clear and *accurate* as "Change Document" for the minor version bump. Use at least 6000 words for your code change review report. Do a thorough review of the current codebase versus the original shared using line by line "diff" comparison.

---
awesome job! now help me to carefully review and validate the application start up log and the "pytest" output attached here.

---
awesome job! now help me to carefully review and validate the "pytest" output attached.

---
awesome job! now help me to very, very carefully review and validate the application start up log below systematically using line by line comparison. then give me a detail analysis report on whether the application still remain healthy after the "models" files update.

---
awesome understanding! now please help me to thoroughly and systematically review the current project codebase using line by line comparison and validation. then create a 6000 words `Code_Review_and_Assessment_Report.md` in markdown format, this document should describe in detail your quality assessment of the current codebase based on your careful and thorough review and analysis of the current codebase, especially paying close attention to files affected by the recent changes.

The current codebase consists of *original* files enclosed in `project_codebase_files_set.md` (v1.2) superseded by some files added or modified in `new_codebase_files_set.md` (v1.5)

1. Refer to  `currect_project_file_structure.txt` for a complete list of all codebase files. If a file is not in this list, the file does not exist yet.

2. Refer to `newly_added_code_files_list.txt` for a list of the newly added files.

3. Refer to `Code Change Review (v1.5).md` for the recent changes made to the codebase - you are to do a very careful and thorough line by line validation for files affected by this change document 

---
awesome job with your code review and analysis! now help me create for me a detailed architecture overview document in markdown and named `Project Architecture Document.md`. Make sure you do a careful review and validation of the application codebase shared. Use line by line review to get a good grounding of the purpose of the application and its codebase. Use at least 6000 words for the document that accurately describes the codebase in detail, use a clear diagram to show the codebase relationship. Include a section to describe the file structure and the purpose of each folder and key files, start with a diagram.

---
awesome job with the architecture document! now please help me create a complete updated *replacement* for `README.md`  that describe and represent the current codebase more accurately, also add the following sections at appropriate point / sequence:

1. add / update a section to show / describe the project codebase file hierarchy
2. add / update a section for a flowchart diagram to describe the interactions between various files and modules
3. add / update a section to list and describe the files in the codebase file hierarchy 
4. Current features implemented (partially or fully), Roadmap for suggested improvements divided into two sections, one for the immediate and one for the long-term goals.
5. Clear and detailed deployment guide starting from the GitHub repository, specify how to install, setup and configure the POS machine to run the code and how to do the same for the database server (docker)
6. add / update a section for user guide on how to use and run the program (application). 

The shared `README.md` is just a draft copy with some incomplete with missing sections. Please create a *complete* updated *replacement* version with at least 4000 words, by filling in relevant details from older versions. Also include additional details to describe recent code changes in the codebase.

*IMPORTANT*, the updated replacment `README.md` must be complete in itself, without containing any references to older versions or other documents.

---
awesome job again! Below is the methodology to review and validate first, then create a correct updated version of the initial Alembic migration file, `migrations/versions/d5a6759ef2f7_initial_schema_setup.py`, which was auto-generated and now needs to be fixed to match the current ORM models.

### 1. Deeply Understand the Goal

I want a file that, when `alembic upgrade head` is run on an empty database, creates a schema that perfectly matches the one defined by the SQLAlchemy models in `app/models/`.

### 2. Systematic Diagnosis & Analysis of Discrepancies

You will compare three sources of truth:
1.  **The Flawed Migration (`migrations/versions/d5a6759ef2f7_initial_schema_setup.py`):** This is the file to be replaced.
2.  **The ORM Models (`app/models/*.py`):** This is the *desired state*. This is the ultimate source of truth for the application logic.
3.  **The SQL Schema (`scripts/database/schema.sql`):** This is a helpful, human-readable reference for the desired state, which seems more up-to-date than the flawed migration.

---
awesome job! based on your comprehensive review of the current codebase, please give me a detailed assessment report in markdown format, that includes recommendations for code improvements or for fixing bugs or issues identified.

---
Awesome job so far! Arrange the recommended improvements and fixes identified into logical phases of tasks, arrange the phases into logical order, then for each phase, think deeply and systematically to explore carefully and thoroughly to plan in detail for the task actions to be completed and files to be created, create a corresponding checklist for each sub-task to be execute and for each file to be created or updated. Come up with a comprehensive plan arranged in logical phases to cover all actions and sub-actions to be carried out, each sub-task with its checklist, before proceeding with the execution one phase at a time. Wait for me to confirm the successful completion of each phase before proceeding to the next phase in the overall comprehensive and detailed execution plan.

*IMPORTANT* to carefully and thoroughly through systematic line by line validation of the below mentioned issues against the current codebase (including the latest updated code files) first before finalizing the list of issues to resolve, only then start your execution planning.

---
awesome plan! awesome job! please proceed with the next step in your plan meticulously and systematically.

---
The changes made recently to address the "greenlet_spawn" error had been extensive and the files listed below had been affected by the refactoring effort. QA is deeply concerned about the possible regression bugs inadvertently introduced by the wide-ranging refactoring. QA want you do a very deep review of *all the changes made to the listed files* since the start of the last round of fixing the "unable to pay to complete a sale transaction" bug. Use a line by line comparison to compare the state of the files at the start of this round of change with the latest state of the files, then carefully review and validate (justify) the changes. Then create a detailed code change review report in markdown format to clearly and logically describe the natural of the issue (as understood), analysis performed and decisions made at each troubleshooting stage, with code snippets to illustrate the change and its justification. Use at least 6000 words for a comprehensive code review analysis report.

---
Still the same error: can't make payment to complete a transaction.

---
Now everything works as before, but not when making final payment to complete a transaction. Actually the recent code changes mentioned in the code change document `Code Change Regression Analysis Report.md` *incorrectly* claimed that the issue was fixed when it was not when I tested it again. So you need to review the changes again and think and explore more deeply and systematically. Start by reviewing the screenshot of the error and the application log shared here.

---
We seem to have made progress because now it is a different error (see attached screenshot) when I tried to complete a transaction. This time the error is not "greenlet_spawn" related, though final sale payment still failed.

---
We seem to have resolved the final payment during a sale transaction issue. Please carefully review the application log and screenshot shared here.

The changes made recently to address the "greenlet_spawn" error had been extensive and the list of files affected is pretty big. QA is deeply concerned about the possible regression bugs inadvertently introduced by the wide-ranging refactoring. QA want you do a very deep review of *all the changes made to the listed files* since the start of the last round of fixing the "unable to pay to complete a sale transaction" bug. Use a line by line comparison to compare the state of the files at the start of this round of change with the latest state of the files, then carefully review and validate (justify) the changes. Then create a detailed code change review report in markdown format to clearly and logically describe the natural of the issue (as understood), analysis performed and decisions made at each troubleshooting stage, with code snippets to illustrate the change and its justification. Use at least 6000 words for a comprehensive code review analysis report. You can create an enhanced report by building on the previous report `Code Change Regression Analysis Report.md`.

---
with the new insights and lessons learned, please help me to create a *complete* updated *replacement* file for the attached `Architecture Design Document.md`. This document is meant to serve as the guide to design a best practices type of architecture for other new projects, so as not to fall into similar pitfalls. Please think deeply and systematically to explore carefully and thoroughly for the best way to improve on this design guide document. 

---
awesome job! now help me to carefully create a *complete* updated *replacement* file for `pyproject.toml` with the versions of the python packages changed to use the versions currently installed as shown below.

---
Awesome job! please help me carefully review and validate the application start up log shared below. If there is no issue, please help me carefully, systematically and meticulously explore for the best implementation option to implement the following improvements. Put on your deep-thinking hat to carefully and thoroughly explore various implementation options for each improvement item, deliberate and evaluate the possible implementation options before choosing the best implementation option for each improvement item. Please come up with a detailed execution plan to implement the chosen options in logical phases and steps, and for each step of, list out the files to be modified or added, and for each of these files, list what changes are needed and add an associated checklist for validating the changes when each file is generated. Please share the detailed execution plan with integrated checklist with me for approval before executing.

