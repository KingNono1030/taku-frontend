import { useParams } from 'react-router-dom';

const CommunityDetailPage = () => {
  const { category, id } = useParams();

  return <div>{`${category} ${id} 커뮤니티 상세 페이지`}</div>;
};

export default CommunityDetailPage;
