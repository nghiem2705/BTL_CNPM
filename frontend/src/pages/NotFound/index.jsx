import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 text-center">
                <div className="space-y-4">
                    {/* 404 Number */}
                    <h1 className="text-9xl font-extrabold text-white opacity-20">
                        404
                    </h1>

                    {/* Main Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Trang không tồn tại
                    </h2>

                    {/* Subheading */}
                    <p className="text-xl text-gray-300 mb-8">
                        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                    </p>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <svg
                        className="w-24 h-24 text-white opacity-75"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        to="/"
                        className="w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Về trang chủ
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-300 bg-transparent hover:bg-white hover:text-gray-900 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Quay lại
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Nếu bạn cho rằng đây là lỗi, vui lòng{' '}
                        <Link
                            to="/contact"
                            className="text-indigo-400 hover:text-indigo-300 underline"
                        >
                            liên hệ với chúng tôi
                        </Link>
                    </p>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-32 w-80 h-80 border border-white border-opacity-10 rounded-full"></div>
                    <div className="absolute -bottom-40 -left-32 w-80 h-80 border border-white border-opacity-10 rounded-full"></div>
                    <div className="absolute top-40 left-10 w-20 h-20 border border-white border-opacity-20 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-40 right-10 w-16 h-16 border border-white border-opacity-20 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;