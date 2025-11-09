"use client";

import { useTranslations } from "next-intl";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
import TarotMeterButton from "./TarotMeterButton";
import MemorchessButton from "./MemorchessButton";

export default function FeaturesSection() {
    const t = useTranslations("features");

    return (
        <Section id="features">
            <SectionTitle>
                <h2 className="text-center mb-4">{t("title")}</h2>
            </SectionTitle>
            <p className="mb-12 text-center">{t("description")}</p>
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
                <TarotMeterButton />
                <MemorchessButton />
            </div>
        </Section>
    );
}
