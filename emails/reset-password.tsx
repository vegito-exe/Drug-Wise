import { Button, Html, Text } from "@react-email/components";

export function ResetPasswordEmail({
  resetUrl,
  locale,
}: {
  resetUrl: string;
  locale: string;
}) {
  return (
    <Html lang={locale === "ar" ? "ar" : "fr"} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb", margin: 0 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px" }}>
          <Text style={{ fontSize: 24, fontWeight: 700, color: "#0d6e4f", textAlign: "center", marginBottom: 24 }}>
            DrugWise
          </Text>

          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1a2e", marginTop: 0 }}>
              {locale === "ar" ? "إعادة تعيين كلمة المرور" : "Réinitialisation du mot de passe"}
            </Text>

            <Text style={{ fontSize: 15, color: "#4a4a5a", lineHeight: 1.6 }}>
              {locale === "ar"
                ? "تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لإنشاء كلمة مرور جديدة. هذا الرابط صالح لمدة ساعة واحدة."
                : "Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valide pendant une heure."}
            </Text>

            <div style={{ textAlign: "center", margin: "32px 0" }}>
              <Button
                href={resetUrl}
                style={{
                  backgroundColor: "#0d6e4f",
                  color: "#ffffff",
                  padding: "12px 32px",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {locale === "ar" ? "إعادة تعيين كلمة المرور" : "Réinitialiser le mot de passe"}
              </Button>
            </div>

            <Text style={{ fontSize: 13, color: "#9a9aaa", marginTop: 24 }}>
              {locale === "ar"
                ? "إذا لم تطلب هذا، تجاهل هذه الرسالة. لن يتم تغيير كلمة المرور الخاصة بك."
                : "Si vous n'avez pas fait cette demande, ignorez cet email. Votre mot de passe ne sera pas modifié."}
            </Text>
          </div>

          <Text style={{ fontSize: 12, color: "#9a9aaa", textAlign: "center", marginTop: 24 }}>
            © 2026 DrugWise
          </Text>
        </div>
      </body>
    </Html>
  );
}
