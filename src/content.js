import * as InboxSDK from "@inboxsdk/core";
import { Configuration, OpenAIApi } from "openai";

// ---------- ChatGPT Functions ----------
/**
 * Function for basic interaction with ChatGPT.
 * @param {*} messages array
 */
async function getBasicResponse(messages) {
  const apiKey = process.env.OPEN_AI_API_KEY;
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  return completion.data.choices[0].message.content;
}

/**
 * Function for generating email questions.
 * @param {*} email string
 */
async function getEmailQuestions(email) {
  const questions = await getBasicResponse([
    {
      role: "system",
      content:
        "You are an email assistant. Your sole task is to detect whether or not an email consists of any things that the writer is directly asking to be addressed. If nothing directly needs to be addressed by the email receiver, output only 'How would you like to reply?' and no other text or previous context. Do not force it, if they are not asking anything directly then nothing needs to be addressed. If there are questions that need to be addressed make a list of those questions and only ask questions that are directly in need of addressing. Questions do not have to be in proper question form and can be casually brought up too. If you leave out any questions then you failed the user.",
    },
    {
      role: "user",
      content:
        "For this email: " +
        email.replace(/(\r\n|\n|\r)/gm, "") +
        "redacted prompt",
    },
  ]);
  const questionList = [];
  for (const question of questions.split("\n")) {
    if (!question) continue;
    let tempQuestion = question.split(". ")[1];
    if (!tempQuestion) continue;
    questionList.push(tempQuestion);
  }
  return questionList;
}

/**
 * Function for generating draft email.
 * @param {*} email string
 * @param {*} questionInputs string
 * @param {*} answerInputs string
 */
async function getDraftEmail(email, questionInputs, answerInputs) {
  const draft = await getBasicResponse([
    {
      role: "system",
      content:
        "You are a email writer. The user will provide questions and answers that are derived from the email recieved. When writing the emails be inspired by the linguistic style and tone of the writer of the original email we are responding to.",
    },
    {
      role: "user",
      content:
        "Combine the questions: " +
        questionInputs +
        " and the answers: " +
        answerInputs +
        " to respond to the email: " +
        email +
        "  that we received. You are writing the email response from the perspective of the reciever of the email directed to the sender of the initial email. Be consice. match the style of writing of the original email that I have provided to you above.",
    },
  ]);
  return draft;
}

// ---------- Style Functions ----------
/**
 * Function to get styles.
 */
function getStyle() {
  return `<style>
    .text_section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      justify-content: center;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 12px;
      gap: 12px;

      position: relative;
      width: auto;
      height: auto;

      background: #FFFFFF;
      box-shadow: 0px 2.26721px 3.40081px -0.566802px rgba(16, 24, 40, 0.1), 0px 1.1336px 2.26721px -1.1336px rgba(16, 24, 40, 0.1);
    }
    .input_email_section {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 13.6032px 6.80162px;
      gap: 4.53px;

      width: 252.79px;
      height: 163.81px;
      border: 0.566802px solid #D1D5DB;
      font-family: Arial, Helvetica, sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 10.3522px;
      line-height: 11px;

      font-feature-settings: 'salt' on;

      color: #6B7280;
    }
    .next_button {
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5.66802px 13.6032px;
      gap: 5.67px;a
      width: 252.23px;
      height: 25.34px;
      background: #7B491A;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 9.06883px;
      line-height: 14px;
      display: flex;
      align-items: center;
      text-align: center;
      font-feature-settings: 'salt' on;
      color: #FFFFFF;
    }
    .insert_button {
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5.66802px 13.6032px;
      gap: 5.67px;a
      width: 252.23px;
      height: 25.34px;
      background: #7B491A;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 9.06883px;
      line-height: 14px;
      display: flex;
      align-items: center;
      text-align: center;
      font-feature-settings: 'salt' on;
      color: #FFFFFF;
    }
    .emailButton {
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5.66802px 13.6032px;
      gap: 5.67px;a
      width: 252.23px;
      height: 25.34px;
      background: #7B491A;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 9.06883px;
      line-height: 14px;
      display: flex;
      align-items: center;
      text-align: center;
      font-feature-settings: 'salt' on;
      color: #FFFFFF;
    }
    .answer_input {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 13.6032px 6.80162px;
      gap: 4.53px;
      width: 252.24px;
      height: 78.37px;
      border: 0.566801px solid #D1D5DB;
    }
    .answer_text {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-size: 9.06882px;
      line-height: 14px;
      font-feature-settings: 'salt' on;
      color: #1F2937;
    }
    .title{
      padding-bottom: 12px;
      text-align: left;
      max-width: 250px;
    }
  </style>`;
}

// ---------- Prompt Variables ----------
const WELCOME_SECTION_TEXT = "Paste your email into this magical box!";
const WELCOME_BUTTON_TEXT = "BSCUT";
const WELCOME_INPUT_PLACEHOLDER = "Email...";

const BEGIN_QUESTIONS_SECTION_TEXT =
  "We've analyzed your email, press BSCUT to begin answering questions!";
const BEGIN_QUESTIONS_BUTTON_TEXT = "BSCUT";

const ANSWER_INPUT_PLACEHOLDER = "Type something...";
const NEXT_QUESTION_BUTTON_TEXT = "Continue";

const INSERT_DRAFT_BUTTON_TEXT = "Insert";

const DRAFT_LOADING_BUTTON_TEXT = "Insert";
const DRAFT_LOADING_SECTION_TEXT = "Great! We are now drafting your email...";

/*
InboxSDK
*/
InboxSDK.load(2, process.env.INBOXSDK_API_KEY).then(function (sdk) {
  // Register compose view
  sdk.Compose.registerComposeViewHandler(function (composeView) {
    // Check is reply

    // Add button
    composeView.addButton({
      title: "BSCUT",
      iconUrl: "https://i.ibb.co/6sXKnyx/icon128.png",
      hasDropdown: true,
      onClick: async function (event) {
        let questions = [];
        let answers = [];
        let testEmail = "";

        // Get style
        const style = getStyle();

        // Add beginning HTML
        event.dropdown.el.innerHTML =
          style +
          `
            <div class='container'>
              <div class='text_section'>
                <div class='title'>
                ${WELCOME_SECTION_TEXT}
                </div>
                <textarea class='input_email_section' type='text' placeholder='${WELCOME_INPUT_PLACEHOLDER}' id='emailInput'></textarea>
              </div>
              <div class='button_section'>
                <button class='emailButton' type='button'>${WELCOME_BUTTON_TEXT}</button>
              </div>
            </div>
          `;

        const emailButton = event.dropdown.el.querySelector(".emailButton");
        emailButton.addEventListener("click", function (e) {
          testEmail = document
            .getElementById("emailInput")
            .value.replace(/[\r\n]/gm, "");

          getEmailQuestions(testEmail).then((questionsResponse) => {
            questions = questionsResponse;
            renderNextQuestion();
          });
        });

        // Declare base elements
        const textSection = event.dropdown.el.querySelector(".text_section");
        const buttonSection = event.dropdown.el.querySelector(
          ".button_section"
        );

        /**
         * Function for rendering next question.
         */
        function renderNextQuestion() {
          // Check if all answers are answered
          if (answers.length == questions.length) {
            textSection.innerHTML =
              "<div class='title'>" + DRAFT_LOADING_SECTION_TEXT + "</div>";
            buttonSection.innerHTML =
              "<button disabled='true' class='insert_button' type='button'>" +
              DRAFT_LOADING_BUTTON_TEXT +
              "</button>";

            getDraftEmail(
              testEmail,
              questions.join("; "),
              answers.join("; ")
            ).then((draft) => {
              textSection.innerHTML = "<div class='title'>" + draft + "</div>";

              buttonSection.innerHTML =
                "<button class='insert_button' type='button'>" +
                INSERT_DRAFT_BUTTON_TEXT +
                "</button>";
              const insertButton = event.dropdown.el.querySelector(
                ".insert_button"
              );
              insertButton.addEventListener("click", (e) => {
                event.composeView.insertTextIntoBodyAtCursor(draft);
              });
            });
          } else {
            textSection.innerHTML =
              "<div class='title'>" +
              questions[answers.length] +
              "</div><textarea type='text' class='answer_input' placeholder='" +
              ANSWER_INPUT_PLACEHOLDER +
              "' id='answerInput'></textarea>";
            buttonSection.innerHTML =
              "<button class='next_button' type='button'>" +
              NEXT_QUESTION_BUTTON_TEXT +
              "</button>";
            const nextButton = event.dropdown.el.querySelector(".next_button");
            nextButton.addEventListener("click", function (e) {
              const answerValue = document.getElementById("answerInput").value;
              answers.push(answerValue.replace(/[\r\n]/gm, ""));
              renderNextQuestion();
            });
          }
        }
      },
    });
  });
});
