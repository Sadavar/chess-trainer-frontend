import Header from './Header.jsx';
import { Button, Image } from '@mantine/core';

import Header from './Header.js';
import { Button, Image } from '@mantine/core';
import { Link } from "react-router-dom";

import AnalyzeGraph from './analyze_graph.png'


export default function LandingPage() {
    return (
        <>
            <Header />
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Hero content */}
                    <div className="pb-12">

                        {/* Section header */}
                        <div className="text-center pb-12 md:pb-16">
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Uncover</span> winning chess moves</h1>
                            <div className="max-w-3xl mx-auto">
                                <p className="text-md sm:text-xl text-gray-600 mb-8 pt-5" data-aos="zoom-y-out" data-aos-delay="150">Turn missed opportunities into learning exercises</p>
                                <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                                    <Button
                                        variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                                        className="gradientButton opacityHover"
                                        component={Link} to="/Analyze"
                                    >Get Started</Button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            <section className="relative">
                {/* Section background (needs .relative class on parent and next sibling elements) */}
                <div className="absolute inset-0 bg-gray-100 pointer-events-none mb-16" aria-hidden="true"></div>
                <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="pt-12 md:pt-20">

                        {/* Section header */}
                        <div className="max-w-3xl mx-auto text-center pb-5">
                            <h1 className="text-3xl sm:text-5xl font-bold">How Does it Work?</h1>
                            {/* <p className="text-xl text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.</p> */}
                        </div>

                        {/* Section content */}
                        <div className="lg:grid lg:grid-cols-12 lg:gap-6">

                            {/* Content */}
                            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6" data-aos="fade-right">
                                {/* <div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
                                    <h3 className="text-3xl font-bold mb-3">Powerful suite of tools</h3>
                                </div> */}
                                {/* Tabs buttons */}
                                <div className="mb-8 md:mb-0">
                                    <a
                                        className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${'bg-white shadow-md border-gray-200 hover:shadow-lg'}`}
                                    >
                                        <div>
                                            <div className="font-bold leading-snug tracking-tight mb-1">Extract Games</div>
                                            <div className="text-gray-600">Take collaboration to the next level with security and administrative features built for teams.</div>
                                        </div>
                                        <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                                            <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                                            </svg>
                                        </div>
                                    </a>
                                    <a
                                        className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${'bg-white shadow-md border-gray-200 hover:shadow-lg'}`}
                                    >
                                        <div>
                                            <div className="font-bold leading-snug tracking-tight mb-1">Analyze Games</div>
                                            <div className="text-gray-600">Take collaboration to the next level with security and administrative features built for teams.</div>
                                        </div>
                                        <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                                            <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" fillRule="nonzero" />
                                            </svg>
                                        </div>
                                    </a>
                                    <a
                                        className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${'bg-white shadow-md border-gray-200 hover:shadow-lg'}`}
                                    >
                                        <div>
                                            <div className="font-bold leading-snug tracking-tight mb-1">Build Puzzles</div>
                                            <div className="text-gray-600">Take collaboration to the next level with security and administrative features built for teams.</div>
                                        </div>
                                        <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                                            <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.334 8.06a.5.5 0 00-.421-.237 6.023 6.023 0 01-5.905-6c0-.41.042-.82.125-1.221a.5.5 0 00-.614-.586 6 6 0 106.832 8.529.5.5 0 00-.017-.485z" fill="#191919" fillRule="nonzero" />
                                            </svg>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Tabs items */}
                            <div className="hidden lg:block max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1">
                                <div className="transition-all">
                                    <div className="relative flex flex-col text-center lg:text-right" data-aos="zoom-y-out">
                                        <div className="relative inline-flex flex-col pt-12">
                                            <Image className="md:max-w-none mx-auto rounded" src={AnalyzeGraph} width={500} height="462" alt="Features bg" />
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </section >
            {/* Bottom area */}
            <div className="pl-5 md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
            </div>
        </>
    );
}


