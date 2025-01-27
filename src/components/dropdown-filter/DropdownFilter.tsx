import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterObjProps = {
  label: string;
  value: string;
};

type DropdownFilterProps = {
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  filterArr: FilterObjProps[];
};

const DropdownFilter = ({
  selectedFilter,
  setSelectedFilter,
  filterArr,
}: DropdownFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {filterArr.find((filter) => filter.value === selectedFilter)?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={selectedFilter}
          onValueChange={setSelectedFilter}
        >
          {filterArr.map((filter: FilterObjProps) => (
            <DropdownMenuRadioItem key={filter.value} value={filter.value}>
              {filter.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownFilter;
