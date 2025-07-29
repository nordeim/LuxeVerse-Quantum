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
awesome response! now help me to carefully review and validate `scripts/database/schema.sql` using line by line comparison with the ORM Models (`app/models/*.py`)

---
awesome answer! now very carefully review the attached files (the previous version of `app/core/application_core.py` and a series of attempted fixes), then think deeply and systematically to explore for the best possible implementation option to generate a *correct* complete updated *replacement* file for `app/core/application_core.py`.

Remember to explore carefully for multiple implementation options before choosing the most optimal and elegant solution to implement the changes. so you have to think deeply and systematically to explore all options and not just choose any option you may think of. also make sure you make a detailed execution plan with an integrated checklist for each step, before proceeding cautiously step by step. after completing each step, always double-check and validate your changes for that step against its checklist before proceeding to the next step. remember to always create a *complete* and updated replacement or new file for the affected files, enclose each complete and updated replacement file within ```python (or ```sql or ```js or or ```ts or ```tsx ```php extension) opening and ``` closing tags. after creating each file, use line by line "diff" command to double-check and validate the created file. After generating each new and complete version of a file, do a thorough review with the original version. after creating each file, use line by line "diff" command to double-check and validate the created file. Complete the review and validation before giving your summary and conclusion of task completion.

The important point is to proceed very carefully so as not to introduce any regression error or accidentally omit the original features or functions. use the same tested rigorous and meticulous approach. thank you and good luck!

---
Below is "diff" command output comparing the previous version with your latest generated version. Please double-check and validate that the changes are valid and that no other original features or functions are lost (omitted). use the same rigorous and meticulous approach to review the diff output below.

---
Awesome job so far! Arrange the following issues, gaps and improvements into logical phases of tasks, arrange the phases into logical order, then for each phase, think deeply and systematically to explore carefully and thoroughly to plan in detail for the task actions to be completed and files to be created, create a corresponding checklist for each sub-task to be execute and for each file to be created or updated. Come up with a comprehensive plan arranged in logical phases to cover all actions and sub-actions to be carried out, each sub-task with its checklist, before proceeding with the execution one phase at a time. Wait for me to confirm the successful completion of each phase before proceeding to the next phase in the overall comprehensive and detailed execution plan.

*IMPORTANT* to carefully and thoroughly through systematic line by line validation of the below mentioned issues against the current codebase (including your latest updated code files) first before finalizing the list of issues to resolve, only then start your execution planning.

---
excellent plan! please proceed cautiously and systematically with the next step in your plan.

Remember to explore carefully for multiple implementation options before choosing the most optimal and elegant solution to implement the changes. so you have to think deeply and systematically to explore all options and not just choose any option you may think of. also make sure you make a detailed execution plan with an integrated checklist for each step, before proceeding cautiously step by step. after completing each step, always double-check and validate your changes for that step against its checklist before proceeding to the next step. remember to always create a *complete* and updated replacement or new file for the affected files, enclose each complete and updated replacement file within ```python (or ```sql or ```js or or ```ts or ```tsx ```php extension) opening and ``` closing tags. after creating each file, use line by line "diff" command to double-check and validate the created file. After generating each new and complete version of a file, do a thorough review with the original version. after creating each file, use line by line "diff" command to double-check and validate the created file. Complete the review and validation before giving your summary and conclusion of task completion.

The important point is to proceed very carefully so as not to introduce any regression error or accidentally omit the original features or functions. use the same tested rigorous and meticulous approach. thank you and good luck!

---
that is an awesome planning. please proceed to execute Phase 1 of your plan meticulously and systematically.

---
awesome job! please help me systematically and thoroughly review and validate the application start up log below. If everything is good, then proceed to execute Phase 1 of your plan meticulously and systematically.

---
Awesome job! Now help me to carefully review and validate the application codebase shared in the `project_codebase_files_set.md` attached earlier. Use line by line review to get a good grounding of the purpose of the application and its codebase, then create for me a detailed architecture overview document in markdown and named `Project Architecture Overview Document.md`. Make sure you do a careful review and validation of the application codebase shared. Use line by line review to get a good grounding of the purpose of the application and its codebase. Use at least 6000 words for the document that accurately describes the codebase in detail, use a clear diagram to show the codebase relationship. Include a section to describe the file structure and the purpose of each folder and key files, start with a diagram.

---
Awesome job! Now, please create a detailed step-by-step deployment guide document named `Deployment Guide.md` in markdown format to clearly and logically layout how to deploy your latest (updated) application code files and schema. Include a section to show the complete project file directory structure for the latest code version, include file names in the file structure. Please review your latest generated code files and then plan first before creating the  `deployment_guide.md` with accurate up-to-date project state. Use at least 5000 words. The step-by-step guide should start from a base Ubuntu Linux 24.04.01 install, it should be complete until the application can be launched, including how to launch and run the application. Include a section for a backup guide. Be detailed and clear and logical that even someone non IT savvy can easily follow.

---
Below is the methodology to create a corrected version of the initial Alembic migration file, `migrations/versions/d5a6759ef2f7_initial_schema_setup.py`, which was auto-generated and now needs to be fixed to match the current ORM models, specifically addressing **Critical Issue #1: Schema Mismatch between ORM and Alembic Migration**.

### 1. Deeply Understand the Goal

I want a file that, when `alembic upgrade head` is run on an empty database, creates a schema that perfectly matches the one defined by the SQLAlchemy models in `app/models/`.

### 2. Systematic Diagnosis & Analysis of Discrepancies

You will compare three sources of truth:
1.  **The Flawed Migration (`migrations/versions/d5a6759ef2f7_initial_schema_setup.py`):** This is the file to be replaced.
2.  **The ORM Models (`app/models/*.py`):** This is the *desired state*. This is the ultimate source of truth for the application logic.
3.  **The SQL Schema (`scripts/database/schema.sql`):** This is a helpful, human-readable reference for the desired state, which seems more up-to-date than the flawed migration.

---
awesome job! now please give me a step by step guide on how to update the actual database schema using the updated `migrations/versions/d5a6759ef2f7_initial_schema_setup.py`.

---
awesome job! please continue to use the same rigorous and meticulous approach to think deeply and systematically using extremely long chain of thought to thoroughly and carefully explore various implementation options, evaluate thoroughly the options, then choose the most optimal implementation option to formulate and provide your answer or solution or propose any code changes in response to my question or query. Also always generate a *complete* updated *replacement* file for each new or existing files that need updating or modification. After generating the complete and updated replacement for each file, use line by line "diff" command to compare the newly generated file against the existing version to ensure that the changes are correct and valid and that no other original features or functions have been omitted or regression errors introduced. Do the line by line "diff" comparison for each file generated. After all the necessary files have been generated and validated, then give your assessment and conclusion as final completion of your given task. Take this methodology seriously as your meta-instruction going forward so that absolute code quality is ensured. 

Now help me to carefully review the project codebase attached as `currect_project_file_structure.txt` (listing of codebase file structure hierarchy) project_codebase_files_set.md (all existing codebase files enclosed). Evaluate and validate each codebase file attached line by line carefully. At the end of the careful review and validation of the entire codebase attached here, you should have a deep and thorough understanding of the purpose and current state of the project. Then create a detailed code review document in markdown format to clearly, thoroughly and logically describe your code review process, your current view / understanding of the entire codebase (using a diagram to clearly and logically illustrate the codebase hierarchy), describe how the various files and modules interact with each other, follow by your assessment and findings of the codebase (detailing any coding or logic errors, quality or other issues discovered), follow by your conclusion and recommendations.

---
excellent understanding! now help me to carefully review my codebase line by line to gain a complete and deep understanding (grounding) of the project's goals and current state and structure. then help me to create a detailed `Project Architecture Document.md` in markdown format. Make sure you do a careful review and validation of the application codebase attached in the files listed below. Use line by line review to get a good grounding of the purpose of the application and its codebase. Use at least 6000 words for the document that accurately describes the codebase in detail, use a clear diagram to show the codebase relationship. Include a section to describe the file structure and the purpose of each folder and key files, start with a diagram.

---
Awesome response! Now help me to carefully review and validate the application codebase attached in the files listed below. Use line by line review to get a good grounding of the purpose of the application and its codebase, then create for me a detailed architecture overview document in markdown and named `Project Architecture Overview Document.md`. Make sure you do a careful review and validation of the application codebase shared. Use line by line review to get a good grounding of the purpose of the application and its codebase. Use at least 6000 words for the document that accurately describes the codebase in detail, use a clear diagram to show the codebase relationship. Include a section to describe the file structure and the purpose of each folder and key files, start with a diagram.

---
You have done yet another awesome job with your careful and thorough code review and analysis! now help me create a complete updated *replacement* for `README.md`  that describe and represent the current codebase more accurately, also add the following sections at appropriate point / sequence:

1. add / update a section to show / describe the project codebase file hierarchy
2. add / update a section for a flowchart diagram to describe the interactions between various files and modules
3. add / update a section to list and describe the files in the codebase file hierarchy 
4. Current features implemented (partially or fully), Roadmap for suggested improvements divided into two sections, one for the immediate and one for the long-term goals.
5. Clear and detailed deployment guide starting from the GitHub repository, specify how to install, setup and configure the POS machine to run the code and how to do the same for the database server (docker)
6. add / update a section for user guide on how to use and run the program (application). 

Attached `README (draft to be updated).md` is incomplete with missing sections. Please create a *complete* updated *replacement* version for it by filling in relevant details from older versions. Also include additional details to describe recent code changes in the codebase since the final version was drafted.

*IMPORTANT*, the updated replacment `README.md` and `Technical Design Specification Document.md` must be complete in itself, without containing any references to older versions or other documents.


Attached `README (final draft to be updated using details from the earlier versions).md` is incomplete with missing sections. Please create a *complete* updated *replacement* version for it by filling in relevant details from older versions, `README (original version).md` and `README (update version).md`. Also include additional details to describe recent code changes in the codebase shared earlier since the final version was drafted. There are also recent addition of tests code files which are enclosed in the `project_codebase_tests_files.md` file attached here. Carefully review the included tests files and update your *complete* updated *replacement* version of `README.md`

---
Awesome job! Now help me to create the `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` files using standard template and content.

---
Awesome job! now carefully review the attached `Execution Plan.md` that was used to produce the current codebase. I want you to use line by line comparison to validate the current codebase against the original execution plan, then create a detailed assessment report in markdown format with at least 6000 words, to describe your comparison analysis and findings between the current (resulting) codebase against the execution plan shared, highlighting any gap or discrepancy discovered in your very careful and systematic analysis using line by line comparison. If a current code file is validated to be syntactically correct implementation of the intent of the file, then it is considered passed (OK). Note that the execution plan is meant to be a guide to create the actual code and config files for the project.

---
awesome comparison analysis report! Based on your findings in this and the earlier "current codebase validation" report, please create a detailed execution plan with integrated checklist to systematically and logically create a *complete* and updated *replacement* file for those files that need to be modified to address the issues that you have identified that will prevent the project to be production worthy.

---
please carefully review the errors and then plan to fix them. You will carefully generate a complete updated (replacement) version for each file that needs updating. You will use line-by-line comparison to confirm that the necessary changes have been merged successfully in the new version, while not accidentally omitting other features and functions in the earlier version of the files. Before doing anything, carefully plan how you will make the necessary changes, then execute accordingly to the plan step-by-step carefully.

Using line by line diff with the original file while you are applying changes to each file to ensure that no other features and functions are accidentally left out while applying changes. we don't want to introduce regression failure while updating the code. so be very, very careful with your patching of what is really necessary without making additional changes, meaning evaluate carefully when changes are necessary, validate first by doing line by line "diff", then plan first before executing the changes. Do testing and simulation if possible. enclose your complete and updated version of the updated files within the ```python (or ```js or ```sql or ```json) opening and ``` closing tags. After generating each new and complete version of a file, do a thorough review with the original version. Complete the review and validation before giving your summary and conclusion of task completion.

Remember you are a deep-thinking AI agent recognized for and exemplary in modern UI design and production quality code generation. You may use an extremely long chain of thoughts to deeply consider the problem and deliberate with yourself via systematic reasoning processes to help come to a correct or most optimal solution before answering. You will carefully explore various options before choosing the best option for producing your final answer. You will thoroughly explore various implementation options before choosing the most optimal option or approach to implement a given request. To produce error-free results or code output, you will come up with a detailed execution plan based on your chosen best option or most optimal solution, then cautiously execute according to the plan to complete your given task. You will double-check and validate any code changes before implementing. You should enclose your thoughts and internal monologue inside <think> </think> tags, and then provide your solution or response to the problem. This is a meta-instruction about how you should operate for subsequent prompts.

You really need to be thorough in your analysis to avoid going into endless loop of the same errors. Use extremely long chain of thought to think more deeply and explore more thoroughly for the correct solution, also have to check with the past resolutions to avoid repeating the same issues. 


$ python3 app/main.py 

---
In your previous generation of updated `app/core/application_core.py`, you forgot to provide a line by line comparison of the files that you just generated against the earlier version of the file. Do not miss this crucial step in future generations. 

Below is "diff" command output comparing the previous version with your latest generated version. Please double-check and validate that the changes are valid and that no other original features or functions are lost (omitted). use the same rigorous and meticulous approach to review the diff output below.

```diff
```

---
In your previous generation of updated `app/core/async_bridge.py`, you forgot to provide a line by line comparison of the files that you just generated against the earlier version of the file. Do not miss this crucial step in future generations. 

Below is "diff" command output comparing the previous version with your latest generated version. Please double-check and validate that the changes are valid and that no other original features or functions are lost (omitted). use the same rigorous and meticulous approach to review the diff output below.

```diff
```

---
Below is "diff" command output comparing the previous version with your latest generated version. Please double-check and validate that the changes are valid and that no other original features or functions are lost (omitted). use the same rigorous and meticulous approach to review the diff output below.

---
In your previous generation of updated `app/core/application_core.py`, you forgot to provide a line by line comparison of the files that you just generated against the earlier version of the file. Do not miss this crucial step in future generations. 

Below is "diff" command output comparing the previous version with your latest generated version. Please double-check and validate that the changes are valid and that no other original features or functions are lost (omitted). use the same rigorous and meticulous approach to review the diff output below.

---
that is an awesome finding and execution plan to fix the error! but you did not generate the *complete* updated *replacement* files as you mentioned in your plan.

Remember to explore carefully for multiple implementation options before choosing the most optimal and elegant solution to implement the changes. so you have to think deeply and systematically to explore all options and not just choose any option you may think of. also make sure you make a detailed execution plan with an integrated checklist for each step, before proceeding cautiously step by step. after completing each step, always double-check and validate your changes for that step against its checklist before proceeding to the next step. remember to always create a *complete* and updated replacement or new file for the affected files, enclose each complete and updated replacement file within ```py (or ```sql or ```js or or ```ts or ```tsx ```php extension) opening and ``` closing tags. after creating each file, use line by line "diff" command to double-check and validate the created file. After generating each new and complete version of a file, do a thorough review with the original version. after creating each file, use line by line "diff" command to double-check and validate the created file. Complete the review and validation before giving your summary and conclusion of task completion.

The important point is to proceed very carefully so as not to introduce any regression error or accidentally omit the original features or functions. use the same tested rigorous and meticulous approach. thank you and good luck!

---
That is an awesome refinement! Now, help me to carefully and systematically do a careful review and deep analysis of the existing codebase plus the updated files to have a deep understandng of the latest codebase with the new features and architectural refinements. Based on the comprehensive review, please create a detailed and awesome `Technical Design Specification Document` in markdown format to describe the application based on your `Product Requirements Document`. Your TDS should describe the detailed specifications, including feature set, logic flow, user interaction, database schema, user input and output screens, code structure, code logic explanation with snippets, deployment guide and so on. Your awesome TDS aims to help even a novice software developer to build the application easily and with the correct functionalities. Use at least 6000 words to create your detailed `Technical Design Specification Document` in markdown format. Again, give me your very best shot and good luck!

---
please get a solid grounding of the current codebase for the application by carefully reviewing the current project code and config files shared, then help me to create a *complete* updated *replacement* file for the attached `README.md` and `Technical_Design_Specification_Document.md`.

---
Awesome job! Now, help me to carefully and systematically do a careful review and deep analysis of the existing codebase plus the updated files to have a deep understandng of the latest codebase with the new features and architectural refinements. Based on the comprehensive review, create for me a *complete* updated replacement files for the `README.md` and the `Technical_Design_Specification_Document.md`.

*IMPORTANT*, the updated replacment `README.md` and `Technical Design Specification Document.md` must be complete in itself, without containing any references to older versions or other documents.

---
please carefully review the errors and then plan to fix them. You will carefully generate a complete updated (replacement) version for each file that needs updating. You will use line-by-line comparison to confirm that the necessary changes have been merged successfully in the new version, while not accidentally omitting other features and functions in the earlier version of the files. Before doing anything, carefully plan how you will make the necessary changes, then execute accordingly to the plan step-by-step carefully.

Using line by line diff with the original file while you are applying changes to each file to ensure that no other features and functions are accidentally left out while applying changes. we don't want to introduce regression failure while updating the code. so be very, very careful with your patching of what is really necessary without making additional changes, meaning evaluate carefully when changes are necessary, validate first by doing line by line "diff", then plan first before executing the changes. Do testing and simulation if possible. enclose your complete and updated version of the updated files within the ```python (or ```js or ```sql or ```json) opening and ``` closing tags. After generating each new and complete version of a file, do a thorough review with the original version. Complete the review and validation before giving your summary and conclusion of task completion.

Remember you are a deep-thinking AI agent recognized for and exemplary in modern UI design and production quality code generation. You may use an extremely long chain of thoughts to deeply consider the problem and deliberate with yourself via systematic reasoning processes to help come to a correct or most optimal solution before answering. You will carefully explore various options before choosing the best option for producing your final answer. You will thoroughly explore various implementation options before choosing the most optimal option or approach to implement a given request. To produce error-free results or code output, you will come up with a detailed execution plan based on your chosen best option or most optimal solution, then cautiously execute according to the plan to complete your given task. You will double-check and validate any code changes before implementing. You should enclose your thoughts and internal monologue inside <think> </think> tags, and then provide your solution or response to the problem. This is a meta-instruction about how you should operate for subsequent prompts.

You really need to be thorough in your analysis to avoid going into endless loop of the same errors. Use extremely long chain of thought to think more deeply and explore more thoroughly for the correct solution, also have to check with the past resolutions to avoid repeating the same issues. 

