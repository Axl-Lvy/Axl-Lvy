"use client";

import { FiCode } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { BsKeyboardFill } from "react-icons/bs";
import { useTranslations } from "next-intl";

const Stats: React.FC = () => {
    const t = useTranslations("stats");

    const stats = [
        {
            key: "activeviam",
            icon: <FiCode size={34} className="text-blue-500" />,
        },
        {
            key: "opensource",
            icon: <SiGithub size={34} className="text-gray-700" />,
        },
        {
            key: "ergonomic",
            icon: <BsKeyboardFill size={34} className="text-green-600" />,
        },
    ];

    return (
        <section id="stats" className="py-10 lg:py-20">
            <div className="grid sm:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <div key={stat.key} className="text-center sm:text-left max-w-md sm:max-w-full mx-auto">
                        <h3 className="mb-5 flex items-center gap-2 text-3xl font-semibold justify-center sm:justify-start">
                            {stat.icon}
                            {t(`${stat.key}.title`)}
                        </h3>
                        <p className="text-foreground-accent">{t(`${stat.key}.description`)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
