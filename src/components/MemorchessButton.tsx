import React from "react";
import Link from "next/link";
import { FiZap } from "react-icons/fi";

const MemorchessButton: React.FC = () => {
    return (
        <Link
            href="/memorchess"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
            <FiZap className="text-xl" />
            <span>Try Memorchess</span>
        </Link>
    );
};

export default MemorchessButton;
