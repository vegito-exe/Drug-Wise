import { render } from "@react-email/render";
import { QuestionAnsweredEmail } from "@/emails/question-answered";
import { ResetPasswordEmail } from "@/emails/reset-password";

const FROM_NAME = process.env.BREVO_SENDER_NAME ?? "DrugWise";
const FROM_EMAIL = process.env.BREVO_SENDER_EMAIL ?? "redjehimimehdi@gmail.com";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

async function sendBrevo({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.warn("BREVO_API_KEY not set — skipping email to " + to);
    return;
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Brevo error ${res.status}:`, body);
    }
  } catch (err) {
    console.error("Failed to send email via Brevo:", err);
  }
}

export async function sendQuestionAnsweredEmail({
  to,
  studentName,
  questionText,
  answerText,
}: {
  to: string;
  studentName: string;
  questionText: string;
  answerText: string;
}): Promise<void> {
  const html = await render(
    <QuestionAnsweredEmail
      studentName={studentName}
      questionText={questionText}
      answerText={answerText}
    />
  );
  await sendBrevo({
    to,
    subject: "Votre question a reçu une réponse",
    html,
  });
}

export async function sendResetPasswordEmail({
  to,
  resetUrl,
  locale,
}: {
  to: string;
  resetUrl: string;
  locale: string;
}): Promise<void> {
  const html = await render(<ResetPasswordEmail resetUrl={resetUrl} locale={locale} />);
  await sendBrevo({
    to,
    subject: locale === "ar" ? "إعادة تعيين كلمة المرور" : "Réinitialisation du mot de passe",
    html,
  });
}