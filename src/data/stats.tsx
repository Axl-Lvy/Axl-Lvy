import { FiCode } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { BsKeyboardFill } from "react-icons/bs";

import { IStats } from "@/types";

export const stats: IStats[] = [
    {
        title: "ActiveViam",
        icon: <FiCode size={34} className="text-blue-500" />,
        description: "Working in R&D at ActiveViam, Paris, building high-performance financial software solutions.",
    },
    {
        title: "Open Source",
        icon: <SiGithub size={34} className="text-gray-700" />,
        description: "Building MemorChess and contributing to the developer community on GitHub.",
    },
    {
        title: "Ergonomic",
        icon: <BsKeyboardFill size={34} className="text-green-600" />,
        description: "Using custom ergonomic keyboard setup for enhanced productivity and comfort.",
    },
];
