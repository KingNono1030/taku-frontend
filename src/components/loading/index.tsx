import LoadingSpinner from './LoadingSpinner';

const index = ({ message = '로딩 중입니다...' }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default index;
