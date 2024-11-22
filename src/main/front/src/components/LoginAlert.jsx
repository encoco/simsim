import React from 'react';

const LoginAlert = ({ onClose, onLogin }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg">
                <div className="p-6">
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                            로그인이 필요합니다
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                이 기능을 사용하기 위해서는 로그인이 필요합니다.
                                로그인 페이지로 이동하시겠습니까?
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-row-reverse gap-2">
                        <button
                            type="button"
                            onClick={onLogin}
                            className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            로그인하기
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAlert;