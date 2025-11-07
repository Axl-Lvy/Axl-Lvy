import Intro from "@/components/Intro";
import TechStack from "@/components/TechStack";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";

const HomePage: React.FC = () => {
    return (
        <>
            <Intro />
            <TechStack />
            <Container>
                <Section id="features" title="What I Do" description="My expertise and current projects"></Section>

                <Stats />

                <Section id="contact" title="" description="">
                    <CTA />
                </Section>
            </Container>
        </>
    );
};

export default HomePage;
