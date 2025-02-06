import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DeleteAlertDialogProps = {
  title: string;
  content: string;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickDelete: () => void;
};

const DeleteAlertDialog = ({
  title = '삭제',
  content = '정말로 삭제하시겠습니까?',
  isDialogOpen,
  setIsDialogOpen,
  handleClickDelete,
}: DeleteAlertDialogProps) => {
  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClickDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;
