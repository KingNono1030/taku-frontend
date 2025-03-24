import { LogOut, Menu, MessageCircle, Settings, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import LogoIcon from '@/assets/logo_icon.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/queries/auth';
import { useUnreadTotal } from '@/queries/chat';
import { useUser } from '@/queries/user';
import useUserStore from '@/store/userStore';

const navLists = [
  { title: '커뮤니티', path: '/community' },
  { title: '쇼츠', path: '/shorts' },
  { title: '덕후장터', path: '/market' },
];

export default function Header() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { data: userDataResponse } = useUser(user?.id as number);

  const { mutate: logout } = useLogout();
  const { data: unreadTotal } = useUnreadTotal();

  return (
    // 가운데 정렬을 위해 container 클래스 추가
    <header className="flex w-full items-center justify-center border-b">
      {/* md보다 클때 좌우 패딩 80px */}
      <div className="container flex h-12 items-center justify-between px-5 md:h-20 md:px-20">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={LogoIcon} alt="Duckwho" />
              <AvatarFallback>DW</AvatarFallback>
            </Avatar>
            <span className="font-semibold">Duckwho</span>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-12 md:flex">
          {navLists.map((nav) => (
            <NavLink
              key={nav.title}
              to={nav.path}
              className={({ isActive }) =>
                `${isActive ? 'font-bold text-[#FDB813]' : 'text-sm font-bold'} hover:text-[#FDB813]`
              }
            >
              {nav.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden rounded-full md:inline-flex"
              onClick={() => navigate('/chat')}
            >
              <MessageCircle className="h-10 w-10" />
              {unreadTotal?.data && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadTotal.data > 99 ? '99+' : unreadTotal.data}
                </div>
              )}
            </Button>
          )}

          <div className="hidden md:inline-flex">
            {userDataResponse?.data ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={userDataResponse?.data?.profileImg}
                      alt={userDataResponse?.data?.nickname}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {userDataResponse?.data?.nickname}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to={'/mypage'}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-6 w-6" />
                      <span>마이페이지</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-6 w-6" />
                    <span>설정</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-6 w-6" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-[#FDB813] text-white hover:bg-[#FDB813]/90"
                asChild
              >
                <Link to={'/login'}>로그인</Link>
              </Button>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full md:hidden">
          <Menu className="h-10 w-10" />
        </Button>
      </div>
    </header>
  );
}
