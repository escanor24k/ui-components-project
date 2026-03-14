"use client";
import { useState } from "react";
import { TagInput } from "@/components/ui/TagInput";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { OTPInput } from "@/components/ui/OTPInput";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Section, DemoRow } from "./Section";

export function InputWidgetsDemo(): React.ReactElement {
  const [tags, setTags] = useState<string[]>(["React", "Next.js", "Tailwind"]);
  const [otpValue, setOtpValue] = useState("");
  const [sliderValue, setSliderValue] = useState(40);

  return (
    <>
      <Section title="Tag Input">
        <DemoRow label="Standard">
          <div className="w-full max-w-md">
            <TagInput tags={tags} onTagsChange={setTags} placeholder="Tag hinzufügen…" maxTags={8} separator="both" />
          </div>
        </DemoRow>
        <p className="text-xs text-(--text-muted)">Enter oder Komma zum Hinzufügen · Backspace zum Entfernen</p>
      </Section>

      <Section title="File Dropzone">
        <div className="max-w-lg">
          <FileDropzone accept={["image/png", "image/jpeg", "image/webp", "application/pdf"]} maxSize={5 * 1024 * 1024} maxFiles={3} />
        </div>
      </Section>

      <Section title="OTP Input">
        <DemoRow label="Standard (6 Stellen)">
          <OTPInput value={otpValue} onChange={setOtpValue} />
        </DemoRow>
        <DemoRow label="Maskiert (PIN)">
          <OTPInput length={4} masked />
        </DemoRow>
        <DemoRow label="Mit Numpad">
          <OTPInput length={4} showNumpad />
        </DemoRow>
        <p className="text-xs text-(--text-muted)">Copy/Paste wird unterstützt · Pfeiltasten zur Navigation · Autofill-Extensions werden unterdrückt</p>
      </Section>

      <Section title="Range Slider">
        <div className="space-y-6 max-w-lg">
          <RangeSlider value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))} showValue showLabel aria-label="Lautstärke" />
          <RangeSlider defaultValue={25} min={0} max={100} step={5} showValue formatValue={(v) => `${v}%`} aria-label="Helligkeit" showLabel />
          <RangeSlider defaultValue={50} haptic={false} aria-label="Ohne Haptic" />
        </div>
      </Section>
    </>
  );
}
