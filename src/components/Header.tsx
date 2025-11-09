"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { HiOutlineXMark, HiBars3 } from "react-icons/hi2";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Container from "./Container";
import { siteDetails } from "@/data/siteDetails";
import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("menu");

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-transparent fixed top-0 left-0 right-0 md:absolute z-50 mx-auto w-full">
            <Container className="!px-0">
                <nav className="shadow-md md:shadow-none bg-white md:bg-transparent mx-auto flex justify-between items-center py-2 px-5 md:py-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/images/A.png" alt="Logo" width={28} height={28} className="min-w-fit w-7 h-7" />
                        <span className="manrope text-xl font-semibold text-foreground cursor-pointer">
                            {siteDetails.siteName}
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <ul className="flex space-x-6">
                            <li>
                                <Link
                                    href="#features"
                                    className="text-foreground hover:text-foreground-accent transition-colors"
                                >
                                    {t("about")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#contact"
                                    className="text-foreground hover:text-foreground-accent transition-colors"
                                >
                                    {t("contact")}
                                </Link>
                            </li>
                        </ul>
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="bg-primary text-black focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <HiBars3 className="h-6 w-6" aria-hidden="true" />
                            )}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            {/* Mobile Menu with Transition */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col space-y-4 pt-1 pb-6 px-6">
                        <li>
                            <Link href="#features" className="text-foreground hover:text-primary block" onClick={toggleMenu}>
                                {t("about")}
                            </Link>
                        </li>
                        <li>
                            <Link href="#contact" className="text-foreground hover:text-primary block" onClick={toggleMenu}>
                                {t("contact")}
                            </Link>
                        </li>
                        <li className="pt-2">
                            <LanguageSwitcher />
                        </li>
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
