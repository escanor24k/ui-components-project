import { Alert } from "@/components/ui/Alert";
import { Section } from "./Section";

export function AlertsDemo(): React.ReactElement {
  return (
    <Section title="Alerts">
      <div className="space-y-3">
        <Alert variant="info" title="Information">
          Diese Funktion befindet sich noch in der Entwicklung. Änderungen sind möglich.
        </Alert>
        <Alert variant="success" title="Erfolgreich gespeichert">
          Alle Änderungen wurden erfolgreich in der Datenbank gespeichert.
        </Alert>
        <Alert variant="warning" title="Achtung">
          Deine Session läuft in 5 Minuten ab. Bitte speichere deine Arbeit.
        </Alert>
        <Alert variant="error" title="Fehler aufgetreten">
          Die Verbindung zum Server konnte nicht hergestellt werden. Bitte versuche es erneut.
        </Alert>
      </div>
    </Section>
  );
}
