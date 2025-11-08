import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    socials: ISocials;
} = {
    subheading: "Software Developer specializing in Java performance optimization at ActiveViam, Paris.",
    quickLinks: [
        {
            text: "About",
            url: "#features",
        },
        {
            text: "Contact",
            url: "#contact",
        },
    ],
    socials: {
        github: "https://github.com/Axl-Lvy",
        linkedin: "https://www.linkedin.com/in/axel-levy-212a0818b",
    },
};
