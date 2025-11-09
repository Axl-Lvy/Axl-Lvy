import Intro from "@/components/Intro";
import TechStack from "@/components/TechStack";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import FeaturesSection from "@/components/FeaturesSection";
import React from "react";

export default function HomePage() {
    return (
        <>
            <Intro />
            <TechStack />
            <Container>
                <FeaturesSection />
                <Stats />
                <Section id="contact">
                    <CTA />
                </Section>
            </Container>
        </>
    );
}
