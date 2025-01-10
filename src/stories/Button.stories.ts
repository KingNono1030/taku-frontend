import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
    asChild: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
};

// 파괴적 버튼
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
    size: 'default',
  },
};

// 외곽선 버튼
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

// 고스트 버튼
export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

// 링크 버튼
export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
};

// 작은 버튼
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

// 큰 버튼
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

// 아이콘 버튼
export const IconButton: Story = {
  args: {
    size: 'icon',
    children: '🔍',
  },
};

// 비활성 버튼
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
