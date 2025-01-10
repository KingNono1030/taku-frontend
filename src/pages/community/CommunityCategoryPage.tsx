import { useParams } from 'react-router-dom';

const CommunityCategoryPage = () => {
  const { category } = useParams();

  return <div>{`${category} 커뮤니티 페이지`}</div>;
};

export default CommunityCategoryPage;
