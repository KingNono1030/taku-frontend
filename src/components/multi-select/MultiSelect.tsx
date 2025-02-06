// src/components/multi-select.tsx
import * as React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';
import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * multi-select 컴포넌트의 다양한 스타일을 처리하기 위한 변형.
 * "variant" prop에 따라 다른 스타일을 정의하기 위해 class-variance-authority (cva)를 사용합니다.
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default:
          'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * MultiSelect 컴포넌트의 Props
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * multi-select 컴포넌트에 표시될 옵션 객체 배열.
   * 각 옵션 객체는 label, value, 그리고 선택적으로 icon을 가집니다.
   */
  options: {
    /** 옵션에 표시될 텍스트. */
    label: string;
    /** 옵션에 연관된 고유 값. */
    value: string;
    /** 옵션 옆에 표시될 선택적 아이콘 컴포넌트. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * 선택된 값이 변경될 때 호출되는 콜백 함수.
   * 새로운 선택된 값 배열을 인자로 받습니다.
   */
  onValueChange: (value: string[]) => void; // eslint-disable-line no-unused-vars

  /** 컴포넌트가 마운트될 때의 기본 선택 값. */
  defaultValue?: string[];

  /**
   * 값이 선택되지 않았을 때 표시될 플레이스홀더 텍스트.
   * 선택 사항이며, 기본값은 "Select options"입니다.
   */
  placeholder?: string;

  /**
   * 표시할 항목의 최대 수. 초과된 선택 항목은 요약됩니다.
   * 선택 사항이며, 기본값은 3입니다.
   */
  maxCount?: number;

  /**
   * 팝오버의 모달리티. true로 설정하면 외부 요소와의 상호작용이 비활성화되고
   * 팝오버 내용만 스크린 리더에 표시됩니다.
   * 선택 사항이며, 기본값은 false입니다.
   */
  modalPopover?: boolean;

  /**
   * true로 설정하면 multi-select 컴포넌트를 다른 컴포넌트의 자식으로 렌더링합니다.
   * 선택 사항이며, 기본값은 false입니다.
   */
  asChild?: boolean;

  /**
   * multi-select 컴포넌트에 사용자 정의 스타일을 적용하기 위한 추가 클래스 이름.
   * 선택 사항이며, 사용자 정의 스타일을 추가하는 데 사용할 수 있습니다.
   */
  className?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = '선택하기...',
      maxCount = 3,
      modalPopover = false,
      asChild = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true);
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild={asChild}>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto',
              className,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(multiSelectVariants({ variant }))}
                      >
                        {IconComponent && (
                          <IconComponent className="mr-2 h-4 w-4" />
                        )}
                        {option?.label}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
                        multiSelectVariants({ variant }),
                      )}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput
              placeholder="검색하기..."
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              <CommandEmpty>검색된 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      selectedValues.length === options.length
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span>(전체선택)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 cursor-pointer justify-center"
                      >
                        초기화
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex h-full min-h-6"
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="max-w-full flex-1 cursor-pointer justify-center"
                  >
                    닫기
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = 'MultiSelect';
