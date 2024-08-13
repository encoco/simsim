import React, { useState } from 'react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('로그인 시도:', email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        계정에 로그인하세요
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                이메일 주소
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="이메일 주소"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            로그인
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        회원가입
                    </a>
                </div>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* 소셜 로그인 버튼들 */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 네이버 */}
                        <div>
                            <a
                                href="#"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-[#03C75A] text-sm font-medium text-white hover:bg-[#02bd54] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03C75A]"
                            >
                                <span className="sr-only">Sign in with Naver</span>
                                <span className="font-bold">N</span>
                            </a>
                        </div>
                        {/* 카카오 */}
                        <div>
                            <a
                                href="#"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-[#FEE500] text-sm font-medium text-[#000000] hover:bg-[#FDD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]"
                            >
                                <span className="sr-only">Sign in with Kakao</span>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3.5c-4.42 0-8 2.81-8 6.27 0 2.32 1.55 4.36 3.91 5.49l-1 3.72 4.1-2.74c.32.04.65.06.99.06 4.42 0 8-2.81 8-6.27s-3.58-6.27-8-6.27z" />
                                </svg>
                            </a>
                        </div>
                        {/* 구글 */}
                        <div>
                            <a
                                href="#"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
                            >
                                <span className="sr-only">Sign in with Google</span>
                                <img src="/googleIMG.png" alt="Google Sign-In" className="h-5 w-5 mr-2" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
