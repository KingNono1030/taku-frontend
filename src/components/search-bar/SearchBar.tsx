import React from 'react';

import { Search } from 'lucide-react';

import { Input } from '../ui/input';

type SearchBarProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
};

const SearchBar = ({
  search,
  setSearch,
  placeholder = '검색하기...',
}: SearchBarProps) => {
  return (
    <div className="relative mx-auto my-[80px] max-w-[560px]">
      <Search className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="rounded-full pl-5"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
    </div>
  );
};

export default SearchBar;
