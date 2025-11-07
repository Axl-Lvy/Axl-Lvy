const TechStack: React.FC = () => {
    return (
        <section id="tech-stack" className="py-16 px-5 bg-background">
            <p className="text-lg font-medium text-center mb-8">Technologies I Work With</p>
            <div className="mt-5 w-full flex flex-wrap flex-row items-center justify-center gap-8 sm:gap-12">
                {/* Java */}
                <div className="flex flex-col items-center gap-2">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" height="48" width="48" alt="Java" />
                    <span className="text-sm">Java</span>
                </div>

                {/* Kotlin */}
                <div className="flex flex-col items-center gap-2">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" height="48" width="48" alt="Kotlin" />
                    <span className="text-sm">Kotlin</span>
                </div>

                {/* Jetpack Compose */}
                <div className="flex flex-col items-center gap-2">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetpackcompose/jetpackcompose-original.svg" height="48" width="48" alt="Jetpack Compose" />
                    <span className="text-sm">Jetpack Compose</span>
                </div>

                {/* Python */}
                <div className="flex flex-col items-center gap-2">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="48" width="48" alt="Python" />
                    <span className="text-sm">Python</span>
                </div>

                {/* GitHub */}
                <div className="flex flex-col items-center gap-2">
                    <img src="https://skillicons.dev/icons?i=github" height="48" width="48" alt="GitHub" />
                    <span className="text-sm">GitHub</span>
                </div>

                {/* IntelliJ */}
                <div className="flex flex-col items-center gap-2">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" height="48" width="48" alt="IntelliJ" />
                    <span className="text-sm">IntelliJ</span>
                </div>
            </div>
        </section>
    )
}

export default TechStack

