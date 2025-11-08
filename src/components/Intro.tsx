"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiCode, FiMapPin, FiBriefcase } from "react-icons/fi";

import { introDetails } from "@/data/intro";

const Intro: React.FC = () => {
    return (
        <section id="hero" className="relative flex items-center justify-center pb-20 pt-32 md:pt-40 px-5 min-h-[80vh]">
            <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
                <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"></div>

            <div className="text-center max-w-5xl w-full">
                <motion.h1
                    className="text-4xl md:text-6xl md:leading-tight font-bold text-foreground mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {introDetails.heading}
                </motion.h1>

                <motion.p
                    className="mt-6 text-lg md:text-xl text-foreground max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {introDetails.subheading}
                </motion.p>

                {/* Animated Info Cards */}
                <motion.div
                    className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                            <FiBriefcase className="text-blue-600 text-2xl" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">ActiveViam</h3>
                        <p className="text-sm text-gray-600">R&D Engineer in Paris</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
                            <FiCode className="text-green-600 text-2xl" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Java Performance</h3>
                        <p className="text-sm text-gray-600">Optimization Specialist</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 mx-auto">
                            <FiMapPin className="text-purple-600 text-2xl" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Paris, France</h3>
                        <p className="text-sm text-gray-600">Based in Europe</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Intro;
