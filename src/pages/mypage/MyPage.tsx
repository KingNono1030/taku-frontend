import { useCallback, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useForm } from 'react-hook-form';

import PaginationComponent from '@/components/custom-pagination/CustomPagination';
import { RHFUploadAvatar } from '@/components/hook-form/RhfUpload';
import { JangterBookMarkCard } from '@/components/market/JangterBookMarkCard';
import { JangterPurchaseCard } from '@/components/market/JangterPurchaseCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORY_MAP } from '@/constants/jangter';
import { cn } from '@/lib/utils';
import { useJangterBookmarks, useUserPurchase } from '@/queries/jangter';
import { useDeleteUser, useEditUser } from '@/queries/user';
import { checkNickname } from '@/services/user';
import useUserStore from '@/store/userStore';
import {
  FindUserPurchaseQuery,
  GetBookmarkListQuery,
} from '@/types/api/jangter.types';

const MyPage = () => {
  const user = useUserStore((state) => state.user);

  const { handleSubmit, setValue, watch } = useForm<{
    sortKey: string;
    sortOrder: string;
  }>({
    defaultValues: {
      sortKey: 'id',
      sortOrder: 'desc',
    },
  });
  const { mutate: deleteUser } = useDeleteUser(user?.id as number);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [purchasePage, setPurchasePage] = useState(0);
  const [purchasequeries, setPurchaseQueries] = useState<FindUserPurchaseQuery>(
    {
      page: purchasePage,
      size: 20,
      sort: 'id,desc',
    },
  );
  const [bookmarksPage, setBookmarksPage] = useState(0);
  const [bookmarksQueries, setBookmarksQueries] =
    useState<GetBookmarkListQuery>({
      categoryId: 0,
      page: bookmarksPage,
      size: 20,
      sort: ['createdAt', 'DESC'],
    });

  const onFilterSubmit = (data: { sortKey: string; sortOrder: string }) => {
    const newSort = `${data.sortKey},${data.sortOrder}`;

    setPurchaseQueries((prev) => ({ ...prev, sort: newSort }));
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data: jangterBookmarksData } = useJangterBookmarks(
    bookmarksQueries as GetBookmarkListQuery,
  );
  const jangterBookmarks = jangterBookmarksData?.data?.content;
  const { data: userPurchasesData } = useUserPurchase(
    user!.id,
    purchasequeries as FindUserPurchaseQuery,
  );
  const userPurchases = userPurchasesData?.data?.content;

  const userEditForm = useForm<{ nickname: string; image?: File }>();
  const {
    handleSubmit: handleEditUserSubmit,
    control: userEditControl,
    watch: userEditWatch,
    setError,
    clearErrors,
    setValue: setEditUserValue,
  } = userEditForm;
  const editUserValues = userEditWatch();
  const { mutate: editUser } = useEditUser(user?.id as number);
  const onUserEditSubmit = async ({
    nickname,
    image,
  }: {
    nickname: string;
    image?: File;
  }) => {
    const formData = new FormData();

    const request = {
      nickname,
      originalFileName: '업로드된 파일명',
      fileType: '파일 타입',
      fileSize: 10485760,
    };

    const requestuserBlob = new Blob([JSON.stringify(request)], {
      type: 'application/json',
    });
    if (image) {
      formData.append('image', image);
    }

    formData.append('request', requestuserBlob);

    editUser(formData);
  };
  const [nicknameAvaibleMessage, setNicknameAvaibleMessage] = useState<
    string | null
  >(null);
  const handleCheckNickname = async () => {
    const nickname = editUserValues.nickname;
    const { data: isNicknameNotValid } = await checkNickname(nickname);
    console.log(isNicknameNotValid);
    isNicknameNotValid
      ? (setError('nickname', { message: '중복된 닉네임입니다.' }),
        setNicknameAvaibleMessage(null))
      : (clearErrors('nickname'),
        setNicknameAvaibleMessage('사용가능한 닉네임입니다.'));
  };

  const handleDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      // 첫 번째 파일만 처리
      const [file] = acceptedFiles;

      if (file) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        // 단일 파일을 profileImage 필드에 설정
        setEditUserValue('image', newFile, {
          shouldValidate: true,
        });
      }
    },
    [setEditUserValue, editUserValues.image],
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] p-6">
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="market">내 장터</TabsTrigger>
          <TabsTrigger value="comments">내 댓글</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">프로필</h1>
              <p className="text-sm text-gray-500">
                기본 정보 및 프로필을 설정할 수 있습니다.
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? '취소' : '프로필 변경'}
            </Button>
          </div>

          <Form {...userEditForm}>
            <form
              id="editUserForm"
              onSubmit={handleEditUserSubmit(onUserEditSubmit)}
              className="space-y-4"
            >
              <h2 className="font-medium">내 정보</h2>
              {isEditing ? (
                <RHFUploadAvatar
                  thumbnail
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDropSingleFile}
                />
              ) : (
                <Avatar className="mx-auto">
                  <AvatarImage
                    className="mx-auto h-40 w-40 rounded-full object-cover"
                    src={user?.profileImg}
                  />
                  <AvatarFallback>{user?.nickname.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}

              <FormField
                control={userEditControl}
                name="nickname"
                disabled={!isEditing}
                defaultValue={user?.nickname}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <div className="flex gap-2">
                      <Input placeholder="닉네임을 입력해주세요" {...field} />
                      {isEditing && (
                        <Button
                          onClick={handleCheckNickname}
                          type="button"
                          disabled={!editUserValues.nickname}
                        >
                          중복 확인
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                    {nicknameAvaibleMessage && (
                      <p className={cn('text-sm font-medium text-green-500')}>
                        {nicknameAvaibleMessage}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex justify-between">
            <Button
              type="button"
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              회원 탈퇴
            </Button>
            {isEditing && (
              <Button type="submit" form="editUserForm">
                저장하기
              </Button>
            )}
          </div>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  정말로 더쿠 회원 탈퇴를 희망하십니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  한 번 삭제된 계정은 복구될 수 없습니다.
                  <br />
                  그럼에도 탈퇴를 원하신다면, 아래 탈퇴 버튼을 눌러
                  진행해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteUser()}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  탈퇴
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="market" className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">내 장터</h1>
            <p className="text-sm text-gray-500">
              내가 작성한 장터 게시글을 확인할 수 있습니다.
            </p>
          </div>
          <Tabs defaultValue="selling" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="selling">구매글</TabsTrigger>
              <TabsTrigger value="buying">판매글</TabsTrigger>
              <TabsTrigger value="bookmark">북마크</TabsTrigger>
            </TabsList>

            <TabsContent value="selling" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">구매 목록</h2>
                <form
                  onSubmit={handleSubmit(onFilterSubmit)}
                  className="space-y-6"
                >
                  <div className="flex gap-2">
                    <Select
                      value={watch('sortKey')}
                      onValueChange={(value) => setValue('sortKey', value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="정렬" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">날짜순</SelectItem>
                        <SelectItem value="title">제목순</SelectItem>
                        <SelectItem value="category">카테고리순</SelectItem>
                        <SelectItem value="price">가격순</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={watch('sortOrder')}
                      onValueChange={(value) => setValue('sortOrder', value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="정렬 기준" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">내림차순</SelectItem>
                        <SelectItem value="asc">오름차순</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="submit">정렬</Button>
                  </div>
                </form>
              </div>

              {userPurchases ? (
                <div className="flex flex-col gap-3 rounded-lg border p-8 text-center text-gray-500">
                  {userPurchases.map((purchase) => (
                    <JangterPurchaseCard key={purchase.id} data={purchase} />
                  ))}
                  <div className="mt-8">
                    <PaginationComponent
                      totalPages={userPurchasesData!.data!.totalPages as number}
                      setCurrentPage={setPurchasePage}
                      currentPage={purchasequeries!.page as number}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border p-8 text-center text-gray-500">
                  작성한 구매글이 없습니다.
                </div>
              )}
            </TabsContent>

            <TabsContent value="buying" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">판매 목록</h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="selling">판매중</SelectItem>
                    <SelectItem value="reserved">예약중</SelectItem>
                    <SelectItem value="completed">판매완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TODO: 판매글 목록 구현 */}
              <div className="rounded-lg border p-8 text-center text-gray-500">
                작성한 판매글이 없습니다.
              </div>
            </TabsContent>

            <TabsContent value="bookmark" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">북마크 목록</h2>
                <form
                  onSubmit={handleSubmit(onFilterSubmit)}
                  className="space-y-6"
                >
                  <div className="flex gap-2">
                    <Select
                      value={String(bookmarksQueries?.categoryId)}
                      onValueChange={(value) => {
                        setBookmarksQueries((prev) => ({
                          ...prev,
                          categoryId: Number(value),
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="정렬" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={'0'}>{'전체 카테고리'}</SelectItem>
                        {Object.keys(CATEGORY_MAP).map((key) => (
                          <SelectItem key={key} value={key}>
                            {CATEGORY_MAP[Number(key)]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={bookmarksQueries?.sort?.[0]}
                      onValueChange={(value) => {
                        const newSort = bookmarksQueries?.sort as string[];
                        newSort[0] = value;
                        setBookmarksQueries((prev) => ({
                          ...prev,
                          sort: newSort,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="정렬" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">날짜순</SelectItem>
                        <SelectItem value="title">제목순</SelectItem>
                        <SelectItem value="category">카테고리순</SelectItem>
                        <SelectItem value="price">가격순</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={bookmarksQueries?.sort?.[1]}
                      onValueChange={(value) => {
                        const newSort = bookmarksQueries?.sort as string[];
                        newSort[1] = value;
                        setBookmarksQueries((prev) => ({
                          ...prev,
                          sort: newSort,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="정렬 기준" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DESC">내림차순</SelectItem>
                        <SelectItem value="ASC">오름차순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              </div>

              {jangterBookmarks ? (
                <div className="flex flex-col gap-3 rounded-lg border p-8 text-center text-gray-500">
                  {jangterBookmarks.map((purchase) => (
                    <JangterBookMarkCard data={purchase} />
                  ))}
                  <div className="mt-8">
                    <PaginationComponent
                      totalPages={
                        jangterBookmarksData!.data!.totalPages as number
                      }
                      setCurrentPage={setBookmarksPage}
                      currentPage={bookmarksQueries!.page as number}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border p-8 text-center text-gray-500">
                  북마크 등록된 상품이 없습니다.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="comments" className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">내 댓글</h1>
            <p className="text-sm text-gray-500">
              내가 작성한 댓글을 확인할 수 있습니다.
            </p>
          </div>
          {/* TODO: 내 댓글 목록 구현 */}
          <div className="rounded-lg border p-8 text-center text-gray-500">
            작성한 댓글이 없습니다.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyPage;
