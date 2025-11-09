import React from "react";
import Link from "next/link";
import { FiZap } from "react-icons/fi";

const TarotMeterButton: React.FC = () => {
    return (
        <Link
            href="/tarotmeter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
            <FiZap className="text-xl" />
            <span>Try TarotMeter</span>
        </Link>
    );
};

export default TarotMeterButton;
