import React from 'react'
import clsx from 'clsx'
import { FaGithub } from 'react-icons/fa'

import { ctaDetails } from '@/data/cta'

const GitHubButton = ({ dark }: { dark?: boolean }) => {
    return (
        <a href={ctaDetails.googlePlayUrl} target="_blank" rel="noopener noreferrer">
            <button
                type="button"
                className={clsx("flex items-center justify-center min-w-[205px] mt-3 px-6 h-14 rounded-full w-full sm:w-fit", { "text-white bg-foreground": dark, "text-foreground bg-white": !dark })}
            >
                <div className="mr-3">
                    <FaGithub size={30} />
                </div>
                <div>
                    <div className="-mt-1 font-sans text-xl font-semibold">
                        GitHub
                    </div>
                </div>
            </button>
        </a>
    )
}

export default GitHubButton

