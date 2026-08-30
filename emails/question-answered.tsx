import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

export function QuestionAnsweredEmail({
  studentName,
  questionText,
  answerText,
}: {
  studentName: string;
  questionText: string;
  answerText: string;
}) {
  return (
    <Html lang="fr">
      <Body style={{ fontFamily: "sans-serif", padding: "16px" }}>
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          {/* ── French Section ── */}
          <Heading style={{ color: "#0f766e", fontSize: "20px" }}>
            DrugWise — une réponse à votre question
          </Heading>
          <Text>Bonjour {studentName},</Text>
          <Text style={{ fontWeight: 600 }}>Votre question :</Text>
          <Section
            style={{
              backgroundColor: "#f1f5f9",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <Text>{questionText}</Text>
          </Section>
          <Text style={{ fontWeight: 600 }}>Réponse de l'équipe :</Text>
          <Section
            style={{
              backgroundColor: "#f0fdfa",
              borderLeft: "4px solid #0f766e",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <Text style={{ whiteSpace: "pre-wrap" }}>{answerText}</Text>
          </Section>
          <Text style={{ color: "#64748b", fontSize: "13px" }}>
            Vous pouvez aussi retrouver cette réponse dans « Mes Questions »
            sur la plateforme.
          </Text>

          <Hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

          {/* ── Arabic Section ── */}
          <div dir="rtl" style={{ textAlign: "right" }}>
            <Heading style={{ color: "#0f766e", fontSize: "20px" }}>
              DrugWise — تمت الإجابة على سؤالك
            </Heading>
            <Text style={{ direction: "rtl" }}>مرحبا {studentName}،</Text>
            <Text style={{ fontWeight: 600, direction: "rtl" }}>سؤالك :</Text>
            <Section
              style={{
                backgroundColor: "#f1f5f9",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <Text style={{ direction: "rtl" }}>{questionText}</Text>
            </Section>
            <Text style={{ fontWeight: 600, direction: "rtl" }}>الإجابة :</Text>
            <Section
              style={{
                backgroundColor: "#f0fdfa",
                borderRight: "4px solid #0f766e",
                borderLeft: "none",
                padding: "12px",
                borderRadius: "8px",
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <Text style={{ whiteSpace: "pre-wrap", direction: "rtl" }}>{answerText}</Text>
            </Section>
            <Text style={{ color: "#64748b", fontSize: "13px", direction: "rtl" }}>
              يمكنك أيضاً الاطلاع على هذه الإجابة في « أسئلتي » على المنصة.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}
