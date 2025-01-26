import CommentItem from './CommentItem';

type CommentProps = {
  commentsArr: any[];
};

const CommentList = ({ commentsArr }: CommentProps) => {
  return (
    <ul className="flex flex-col gap-4 py-4">
      {commentsArr.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
};

export default CommentList;
