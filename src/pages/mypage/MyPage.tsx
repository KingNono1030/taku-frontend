import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useForm } from 'react-hook-form';

import PaginationComponent from '@/components/custom-pagination/CustomPagination';
import { JangterPurchaseCard } from '@/components/market/JangterPurchaseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUserPurchase } from '@/queries/jangter';
import useUserStore from '@/store/userStore';
import { FindUserPurchaseQuery } from '@/types/api/jangter.types';

// 목데이터
const mockUserData = {
  name: '홍길동',
  email: 'gildong@naver.com',
  nickname: 'ABCDE12345',
  introduction: '간단한 소개글을 작성해보세요!',
};

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

  const [purchasePage, setPurchasePage] = useState(0);
  const [purchasequeries, setPurchaseQueries] = useState<FindUserPurchaseQuery>(
    {
      page: purchasePage,
      size: 20,
      sort: 'id,desc',
    },
  );

  const onSubmit = (data: { sortKey: string; sortOrder: string }) => {
    const newSort = `${data.sortKey},${data.sortOrder}`;

    setPurchaseQueries((prev) => ({ ...prev, sort: newSort }));
  };

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);

  const { data: userPurchasesData } = useUserPurchase(
    user!.user_id,
    purchasequeries as FindUserPurchaseQuery,
  );
  const userPurchases = userPurchasesData?.data?.content;

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

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-medium">내 정보</h2>
              <Avatar className="mx-auto">
                <AvatarImage
                  className="mx-auto h-40 w-40 rounded-full object-cover"
                  src={user?.profile_image}
                />
                <AvatarFallback>{user?.nickname.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-4">
                <div>
                  <Label>닉네임</Label>
                  <Input
                    value={user?.nickname}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setUserData({ ...userData, nickname: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>소개</Label>
                  <Textarea
                    value={userData.introduction}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setUserData({ ...userData, introduction: e.target.value })
                    }
                    placeholder="간단한 소개글을 작성해보세요!"
                    className="h-24"
                  />
                  <div className="mt-1 text-right text-sm text-gray-500">
                    0/100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  // TODO: API 호출
                }}
              >
                저장하기
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="market" className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">내 장터</h1>
            <p className="text-sm text-gray-500">
              내가 작성한 장터 게시글을 확인할 수 있습니다.
            </p>
          </div>
          <Tabs defaultValue="selling" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="selling">구매글</TabsTrigger>
              <TabsTrigger value="buying">판매글</TabsTrigger>
            </TabsList>

            <TabsContent value="selling" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">구매 목록</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <div className="rounded-lg border p-8 text-center text-gray-500">
                  {userPurchases.map((purchase) => (
                    <JangterPurchaseCard data={purchase} />
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

              {/* TODO: 구매글 목록 구현 */}
              <div className="rounded-lg border p-8 text-center text-gray-500">
                작성한 판매글이 없습니다.
              </div>
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
